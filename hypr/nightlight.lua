--[[
  hypr/nightlight.lua — modo noturno automático (hyprsunset)
  Liga às ON_HOUR:ON_MINUTE e desliga às OFF_HOUR:OFF_MINUTE (próximo dia).
  Override manual continua funcionando via waybar (script set on/off é idempotente);
  o agendamento é feito com timers one-shot recalculados a cada disparo.
]]

local SCRIPT = "/home/monteiro/.config/waybar/scripts/nightlight.sh"

local ON_HOUR, ON_MINUTE = 18, 0
local OFF_HOUR, OFF_MINUTE = 6, 0

-- referências dos timers (evita coleta e permite desligar se precisar)
local timers = {}

local function minutes_now()
  local t = os.date("*t")
  return t.hour * 60 + t.min
end

local function boundary_ms(hour, minute)
  local now = os.time()
  local t = os.date("*t", now)
  local target = os.time({ year = t.year, month = t.month, day = t.day, hour = hour, min = minute, sec = 0 })
  if target <= now then
    target = target + 24 * 3600 -- já passou hoje → próximo dia
  end
  return (target - now) * 1000
end

local function schedule()
  local mins = minutes_now()
  local on_mins = ON_HOUR * 60 + ON_MINUTE
  local off_mins = OFF_HOUR * 60 + OFF_MINUTE

  local next_on, next_off
  if mins < off_mins then
    -- madrugada: próxima virada é o OFF (hoje) e depois o ON
    next_off = boundary_ms(OFF_HOUR, OFF_MINUTE)
    next_on = boundary_ms(ON_HOUR, ON_MINUTE)
  elseif mins < on_mins then
    -- dia: próxima virada é o ON (hoje)
    next_on = boundary_ms(ON_HOUR, ON_MINUTE)
  else
    -- noite: próxima virada é o OFF (amanhã)
    next_off = boundary_ms(OFF_HOUR, OFF_MINUTE)
  end

  if next_on then
    timers[#timers + 1] = hl.timer(function()
      hl.exec_cmd(SCRIPT .. " set on")
      schedule() -- agenda a próxima virada
    end, { timeout = next_on, type = "oneshot" })
  end
  if next_off then
    timers[#timers + 1] = hl.timer(function()
      hl.exec_cmd(SCRIPT .. " set off")
      schedule()
    end, { timeout = next_off, type = "oneshot" })
  end
end

-- estado inicial: aplicado com ATRASO (timer) para não rodar durante o
-- load/reload da config — spawn do hyprsunset na fase de carga causava
-- race com o flushCaches do compositor (crash signal 6 no full-reset).
local mins = minutes_now()
local on_mins = ON_HOUR * 60 + ON_MINUTE
local off_mins = OFF_HOUR * 60 + OFF_MINUTE
local need_night = (mins >= on_mins or mins < off_mins)
timers[#timers + 1] = hl.timer(function()
  if need_night then
    hl.exec_cmd(SCRIPT .. " set on")
  else
    hl.exec_cmd(SCRIPT .. " set off")
  end
end, { timeout = 3000, type = "oneshot" })

schedule()
