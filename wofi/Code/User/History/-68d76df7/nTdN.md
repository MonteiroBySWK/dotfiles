# Visão Geral

Objetivo: resolver (1) filas extensas no embarque e (2) venda de bilhetes desorganizada com risco de fraude, por meio de uma API Node.js + TypeScript que habilita **check‑in antecipado com QR Code** e **plataforma de bilhetagem 100% digital** com **PIX e cartão**.

---

## Requisitos-Chave

* **Bilhetagem digital** (PIX, cartão), com emissão de **comprovante/QR**.
* **Gestão de capacidade por viagem** (passageiros x veículos, categorias e pesos).
* **Janela de check‑in** (abertura/fechamento configurável) e **fila virtual**.
* **QR Code de uso único** validado online/offline.
* **Prevenção de fraude** (vinculação pessoa/veículo, antifraude básico, logs).
* **Operação em terminais** (aparelhos de conferência, catraca/barreira veicular, painéis de chamada).
* **Observabilidade** (auditoria, métricas, trilhas de evento, alertas).

---

## Entidades Principais (Domínio)

### 1) Actor / Usuário

* **User**: id, name, email, phone, document (CPF/CNPJ), verified\_at, roles \[`CUSTOMER`, `OPERATOR`, `ADMIN`].
* **OperatorProfile** (para pessoal do terminal/empresa): id, user\_id, terminal\_id, permissions.

### 2) Operação (Rotas, Viagens, Capacidade)

* **Terminal**: id, name, geo (lat/lng), address, timezone, configs (horários de operação, filas separadas).
* **Route**: id, name, origin\_terminal\_id, destination\_terminal\_id, distance\_nm, active.
* **Vessel**: id, name, plate/imo, capacities {foot\_passengers, vehicles\_total, vehicle\_axle\_limit, weight\_limit\_kg}, active.
* **Sailing (Viagem)**: id, route\_id, vessel\_id, departure\_scheduled\_at, arrival\_eta\_at, status \[`SCHEDULED`,`BOARDING`,`DEPARTED`,`ARRIVED`,`CANCELLED`], capacity\_snapshot (por classe/tipo), overbook\_policy.
* **CapacityBucket**: id, sailing\_id, class (`FOOT`,`MOTORCYCLE`,`CAR`,`TRUCK`,`BUS`…), quota, reserved, checked\_in, boarded.

### 3) Comercial (Produtos, Tarifas, Pedidos)

* **FareClass**: id, code, description.
* **TariffRule**: id, route\_id, fare\_class, price, currency, conditions (p.ex. residente, idoso, horários, sazonalidade), versioning.
* **Product**: id, fare\_class\_id, description (pessoa, veículo eixos/peso), requires\_vehicle (bool), addons (p.ex. prioridade, pet).
* **Order**: id, user\_id, channel (`WEB`,`APP`,`KIOSK`,`OPERATOR`), total\_amount, currency, status \[`CREATED`,`PENDING_PAYMENT`,`PAID`,`CANCELLED`,`EXPIRED`,`REFUNDED`], idempotency\_key.
* **OrderItem**: id, order\_id, product\_id, qty, unit\_price, meta (nome passageiro, doc, veículo, placa, eixos, peso declarado).
* **Reservation (Reserva)**: id, order\_id, sailing\_id, items\_ref (linka itens x buckets), status \[`HELD`,`CONFIRMED`,`CANCELLED`,`EXPIRED`], hold\_expires\_at.

### 4) Check‑in / Embarque

* **CheckinWindow**: id, sailing\_id, opens\_at (ex.: T‑24h), closes\_at (ex.: T‑30min), online\_only (bool).
* **BoardingPass**: id, reservation\_id, passenger\_ref, vehicle\_ref, qr\_payload (assinado), one\_time\_token, status \[`ISSUED`,`USED`,`REVOKED`,`EXPIRED`].
* **QueueTicket (Fila Virtual)**: id, sailing\_id, kind (`FOOT`,`VEHICLE`), priority (`NORMAL`,`PRIORITY`), eta\_slot, position, status \[`WAITING`,`CALLED`,`EXPIRED`,`CANCELLED`].
* **GateDevice**: id, terminal\_id, type (`TURNSTILE`,`LANE_READER`,`HANDHELD`), online (bool), last\_seen\_at, public\_key.

### 5) Pagamentos

* **Payment**: id, order\_id, provider (`PIX`,`CARD`), provider\_ref, amount, status \[`INITIATED`,`PENDING`,`AUTHORIZED`,`CAPTURED`,`FAILED`,`REFUNDED`,`CHARGEBACK`], received\_at.
* **PixCharge**: id, payment\_id, txid, qr\_emvco, expires\_at.
* **CardCharge**: id, payment\_id, authorization\_code, capture\_id, installments.

### 6) Segurança, Observabilidade e Suporte

* **FraudCheck**: id, order\_id/reservation\_id, signals (múltiplas compras, documentos duplicados, IP/device), score, outcome.
* **AuditLog**: id, actor\_id, action, entity, entity\_id, payload, created\_at.
* **WebhookEndpoint**: id, url, secret, events (p.ex. `payment.captured`, `boarding.used`).
* **Attachment** (opcional): id, entity\_ref, type (comprovante, DAE), url.

---

## Relacionamentos Essenciais

* **User 1—N Order**; **Order 1—N Payment**; **Order 1—N OrderItem**.
* **Order 1—1 Reservation** (ou N—1 dependendo do carrinho); **Reservation N—1 Sailing**.
* **Sailing 1—N CapacityBucket**.
* **Reservation 1—N BoardingPass** (pessoa e/ou veículo).
* **Sailing 1—N QueueTicket** (fila virtual por viagem e tipo).
* **Terminal 1—N GateDevice**; **Route** liga dois **Terminal**; **Route 1—N Sailing**; **Vessel 1—N Sailing**.

---

## Máquinas de Estado (Resumo)

### Reservation

`HELD → CONFIRMED → [CHECKED_IN] → COMPLETED`

Cancelamentos: `HELD/CONFIRMED → CANCELLED` (por cliente, operação) ou `→ EXPIRED` (hold/payment timeout). No‑show: `CONFIRMED → EXPIRED` pós encerramento.

### Payment

`INITIATED → PENDING → AUTHORIZED/CAPTURED → [REFUNDED/CHARGEBACK]` ou `→ FAILED`.

### BoardingPass

`ISSUED → USED` (validação QR com one‑time) ou `→ REVOKED/EXPIRED`.

### QueueTicket

`WAITING → CALLED → [EXPIRED/CANCELLED]`.

---

## Fluxos de Processos

### A) Compra (PIX/Cartão) + Reserva de Vaga

1. **Selecionar viagem** (rota, data/hora) e tipo (passageiro a pé e/ou veículo).
2. **Cotação** via `TariffRule` (aplica condições e calcula `Order` + `OrderItem`).
3. **Criar Reservation(HELD)** com bloqueio temporário de capacidade por bucket.
4. **Iniciar Payment**.

   * PIX: gerar `PixCharge` (txid + QR EMV), `Payment=PENDING` até confirmação.
   * Cartão: `AUTHORIZED` → `CAPTURED` após confirmação.
5. **Confirmação**: ao `Payment=CAPTURED`, marcar `Reservation=CONFIRMED` e **emitir BoardingPass** (um por passageiro/veículo) com **QR assinado** e `one_time_token`.
6. **Notificações/Webhooks**: envio de recibo, termos, e evento `order.paid`.

### B) Check‑in Antecipado Online + Fila Virtual

1. **Janela abre** conforme `CheckinWindow`.
2. Cliente acessa reserva → **Check‑in** (valida documentos, placa, peso informado, aceite de termos). Atualiza `Reservation` com carimbos e gera/atualiza `BoardingPass`.
3. **Fila Virtual**: gera/associa `QueueTicket` com posição/ETA por **tipo** (FOOT/VEHICLE) e prioridade.
4. **Chamada escalonada**: sistema muda `QueueTicket → CALLED` por lotes conforme **capacidade real** do `Sailing` e sinalização do operador.
5. Painéis e push indicam **portão/catraca/faixa** designados.

### C) Embarque com QR + Operação em Campo

1. Em `BOARDING`, **GateDevice** valida **QR** (online preferível; offline com CRL curta):

   * Confere assinatura, `one_time_token` ainda não usado, match com `Sailing`, bucket e pessoa/veículo.
   * Marca `BoardingPass → USED`, incrementa `CapacityBucket.boarded`.
2. Para veículos: operador pode revisar **peso/altura**; se divergência, gerar **ajuste tarifário** (Order adicional) ou desviar para lista de espera.
3. **Telemetria** em tempo real (ocupação, ritmo de chamada, no‑shows) para **decisão operacional**.

### D) Pós‑Viagem / No‑show / Reembolso

* Ao encerrar `BOARDING`, reservas **não usadas** viram `EXPIRED` (regra de reembolso configurável).
* **Reembolso**: parcial/total via provedor; emitir `Payment=REFUNDED`, atualizar `Order`.

---

## Esquema de Dados (esboço Postgres)

> Chaves primárias como `uuid`; timestamps `created_at/updated_at` em todas.

* `users(id, name, email, phone, document, roles[], verified_at)`
* `terminals(id, name, lat, lng, address, timezone, config jsonb)`
* `routes(id, origin_terminal_id, destination_terminal_id, name, distance_nm, active)`
* `vessels(id, name, plate, capacities jsonb, active)`
* `sailings(id, route_id, vessel_id, departure_scheduled_at, arrival_eta_at, status, capacity_snapshot jsonb, overbook_policy jsonb)`
* `capacity_buckets(id, sailing_id, class, quota, reserved, checked_in, boarded)`
* `fare_classes(id, code, description)`
* `tariff_rules(id, route_id, fare_class, price, currency, conditions jsonb, valid_from, valid_to, version)`
* `products(id, fare_class_id, description, requires_vehicle, addons jsonb)`
* `orders(id, user_id, channel, total_amount, currency, status, idempotency_key)`
* `order_items(id, order_id, product_id, qty, unit_price, meta jsonb)`
* `reservations(id, order_id, sailing_id, status, hold_expires_at, meta jsonb)`
* `checkin_windows(id, sailing_id, opens_at, closes_at, online_only)`
* `boarding_passes(id, reservation_id, passenger_ref, vehicle_ref, qr_payload, one_time_token, status)`
* `queue_tickets(id, sailing_id, kind, priority, eta_slot, position, status)`
* `payments(id, order_id, provider, provider_ref, amount, status, received_at)`
* `pix_charges(id, payment_id, txid, qr_emvco, expires_at)`
* `card_charges(id, payment_id, authorization_code, capture_id, installments)`
* `fraud_checks(id, reservation_id, signals jsonb, score, outcome)`
* `gate_devices(id, terminal_id, type, online, last_seen_at, public_key)`
* `audit_logs(id, actor_id, action, entity, entity_id, payload jsonb)`
* `webhook_endpoints(id, url, secret, events text[])`

**Índices e Restrições** (exemplos):

* `UNIQUE (sailing_id, class)` em `capacity_buckets`.
* `CHECK quota >= reserved >= checked_in >= boarded`.
* `UNIQUE (reservation_id, passenger_ref, vehicle_ref)` em `boarding_passes`.
* `UNIQUE (order_id)` em `reservations` (se 1–1) ou `(order_id, sailing_id)` (multi‑viagem).
* `EXCLUDE USING gist` para evitar overbooking por bucket (somatório de `reserved` por `sailing_id,class`).

---

## API (esboço REST)

### Público/Cliente

* `POST /auth/signup` | `POST /auth/login`
* `GET /routes` | `GET /sailings?routeId&date`
* `POST /orders` (body: items, sailingId) → cria `Order` + `Reservation(HELD)`
* `POST /orders/:id/payments` (provider=`PIX`|`CARD`)
* `GET /payments/:id` (poll) | webhooks
* `POST /reservations/:id/checkin` (valida docs, placa, termos)
* `GET /boarding-passes/:id/qrcode`
* `GET /queue/:sailingId/me` (status do ticket)

### Operacional

* `GET /sailings/:id/dashboard` (ocupação, ritmo)
* `POST /sailings/:id/call-queue` (lote, kind, priority)
* `POST /boarding/scan` (device→valida QR; responde `ALLOW/DENY`, gate info)
* `POST /reservations/:id/override` (ajustes operacionais; requires role)

### Admin

* CRUD `tariff_rules`, `products`, `checkin_windows`, `terminals`, `vessels`.
* `POST /webhooks/test` | `POST /refunds`

**Padrões técnicos**: idempotência via header `Idempotency-Key`, versionamento `Accept: application/vnd.ferrybolt.v1+json`, correlação `X-Request-Id`.

---

## Segurança & Antifraude (MVP viável)

* **QR assinado** (JWT/JWS) com claims: `bp_id`, `reservation_id`, `sailing_id`, `kind`, `hash(document|placa)`, `nonce`, `exp ≤ closes_at`.
* **Uso único**: ao validar, registrar `one_time_token` em cache (Redis) com TTL curto e marcação `USED`.
* **Vínculo pessoa/veículo**: placa/documento conferidos no check‑in e amostragem no gate.
* **Rate‑limiting** e **HMAC** em `/boarding/scan` por `GateDevice`.
* **AuditLog** em todas as transições críticas (pagamento, emissão, uso de QR, overrides).

---

## Regras de Negócio Relevantes

* **Janela de check‑in**: abrir T‑24h (configurável) e fechar T‑30min (padrão); fora da janela, só operador.
* **Prioridade**: pessoas com mobilidade reduzida/idosos e serviço emergencial recebem `priority` na fila.
* **No‑show**: após fechamento, expira; política de reembolso/taxa configurável por rota.
* **Overbooking controlado**: até X% para passageiros a pé; **sem** overbooking para veículos pesados.
* **Espera inteligente**: lista de espera por bucket, chamada automática se houver desistências.

---

## Eventos (Assíncrono/Webhooks)

* `order.paid`, `payment.captured`, `reservation.confirmed`, `reservation.checkin`, `queue.called`, `boarding.used`, `sailing.status.changed`.

---

## Roadmap Técnico (API Node + TS)

1. **Módulos**: `auth`, `catalog` (rotas/viagens), `pricing`, `orders`, `payments`, `reservations`, `checkin`, `boarding`, `ops`, `admin`.
2. **Infra**: Postgres, Redis (locks, fila virtual, OTP), mensageria (Rabbit/Kafka) opcional.
3. **Providers**: PIX (PSP), Cartão (gateway), Notificações (email/SMS/push).
4. **Observabilidade**: OpenTelemetry, logs estruturados, métricas (Prometheus) e dashboards.
5. **Testes**: unidade (Jest), integração (Supertest), contratos (OpenAPI), e2e (Postman/Newman).

---

## Exemplos de Tipos (TypeScript, nível de domínio)

```ts
export type UUID = string;

export enum BucketClass { FOOT = 'FOOT', MOTORCYCLE = 'MOTORCYCLE', CAR = 'CAR', TRUCK = 'TRUCK', BUS = 'BUS' }
export enum ReservationStatus { HELD='HELD', CONFIRMED='CONFIRMED', CANCELLED='CANCELLED', EXPIRED='EXPIRED' }
export enum PaymentStatus { INITIATED='INITIATED', PENDING='PENDING', AUTHORIZED='AUTHORIZED', CAPTURED='CAPTURED', FAILED='FAILED', REFUNDED='REFUNDED', CHARGEBACK='CHARGEBACK' }
export enum BoardingPassStatus { ISSUED='ISSUED', USED='USED', REVOKED='REVOKED', EXPIRED='EXPIRED' }

export interface CapacityBucket { id: UUID; sailingId: UUID; class: BucketClass; quota: number; reserved: number; checkedIn: number; boarded: number; }
export interface Sailing { id: UUID; routeId: UUID; vesselId: UUID; departureScheduledAt: string; status: 'SCHEDULED'|'BOARDING'|'DEPARTED'|'ARRIVED'|'CANCELLED'; }
export interface Reservation { id: UUID; orderId: UUID; sailingId: UUID; status: ReservationStatus; holdExpiresAt?: string; }
export interface BoardingPass { id: UUID; reservationId: UUID; qr: string; oneTimeToken: string; status: BoardingPassStatus; }
```

---

## Métricas de Sucesso

* **Tempo médio de embarque** ↓
* **Taxa de no‑show** ↓
* **Fraudes/uso duplicado** ≈ 0
* **Satisfação NPS** ↑
* **Receita por viagem** (otimização de ocupação) ↑

---

> Este modelo está pronto para virar um **OpenAPI** e um esqueleto de projeto (NestJS/Express + Prisma/TypeORM). Podemos evoluir para diagramas (ERD/Sequência) e endpoints detalhados conforme a próxima etapa.
