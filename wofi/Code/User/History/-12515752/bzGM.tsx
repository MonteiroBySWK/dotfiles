"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formCadastroSchema,
  FormCadastroData,
  ACCEPTED_FILE_TYPES,
} from "@/app/validators/form-cadastro-schema";

export default function FormCadastro() {
  // Utilizando useState pois o react form não lida bem com FileList
  const [laudoMedico, setLaudoMedico] = useState<File | null>(null);
  const [comprovanteResidencia, setComprovanteResidencia] =
    useState<File | null>(null);

  const tiposDeficiencia = [
    { key: "sensorial", label: "Sensorial" },
    { key: "fisica", label: "Física" },
    { key: "tea", label: "TEA - Transtorno do Espectro Autista" },
    { key: "intelectual", label: "Intelectual" },
    { key: "t21", label: "T21 - Síndrome de Down" },
  ];

  const grauDependencia = [
    { key: "leve", label: "Leve" },
    { key: "moderado", label: "Moderado" },
    { key: "severo", label: "Severo" },
  ];

  type SituacaoVulnerabilidade =
    | "baixa_renda"
    | "violencia_domestica"
    | "moradia_precaria"
    | "desnutricao"
    | "risco_social"
    | "outra";

  const origemEncaminhamento = [
    { key: "cras", label: "CRAS" },
    { key: "creas", label: "CREAS" },
    { key: "judiciario", label: "Judiciário" },
    { key: "saude", label: "Saúde" },
    { key: "educacao", label: "Educação" },
    { key: "demanda_espontanea", label: "Demanda Espontânea" },
  ];

  const getDataForm = () => {
    const date = new Date();
    const dataFormulario = date.toLocaleDateString("sv-SE"); // output: YYYY-MM-DD no fuso local
    return dataFormulario;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormCadastroData>({
    resolver: zodResolver(formCadastroSchema),
  });

  const onSubmit = async (data: FormCadastroData) => {
    // Validação de laudo e comprovante
    if (!laudoMedico) {
      alert("Você precisa enviar o Laudo Médico");
      return; // interrompe o envio
    }

    if (!comprovanteResidencia) {
      alert("Você precisa enviar o Comprovante de Residência");
      return; // interrompe o envio
    }

    if (!ACCEPTED_FILE_TYPES.includes(laudoMedico.type)) {
      alert("Formato de Laudo inválido");
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(comprovanteResidencia.type)) {
      alert("Formato de Comprovante inválido");
      return;
    }

    // Console log para ver os dados enviados
    console.log("Form enviado com sucesso ", data);

    const formData = new FormData();

    formData.append("dataCadastro", getDataForm());

    // Adiciona os valores dos campos validados
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });

    try {
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Cadastro realizado com Sucesso!"); // Feedback visual para o usuário
        reset();
        // Em caso de sucesso, os inputs são limpados
        setLaudoMedico(null);
        setComprovanteResidencia(null);
      } else {
        alert("Erro ao cadastrar usuário"); // Feedback visual para o usuário
      }
    } catch (error) {
      console.log("Erro: ", error);
      alert("Erro de conexão com servidor!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto  p-6 bg-white rounded-xl shadow-lg space-y-8"
    >
      {/* Seção Candidato */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Dados do Candidato</h2>
        <div className="">
          <div className="my-4">
            <label className="block mb-1">Nome Candidato</label>
          </div>
          <Controller
            name="nomeCandidato"
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                placeholder="Digite o nome"
                className="w-full"
              />
            )}
          />
          {errors.nomeCandidato && (
            <p className="text-red-500">{errors.nomeCandidato.message}</p>
          )}

          <div className="my-4">
            <label className="block mb-1">Data Nascimento</label>
          </div>
          <Controller
            name="dataNascimento"
            control={control}
            render={({ field }) => (
              <Calendar
                {...field}
                value={field.value ? new Date(field.value) : null}
                onChange={(e) =>
                  field.onChange(
                    e.value ? e.value.toISOString().slice(0, 10) : ""
                  )
                }
                dateFormat="dd/mm/yy"
                placeholder="dd/mm/aaaa"
                className="w-full"
              />
            )}
          />
          {errors.dataNascimento && (
            <p className="text-red-500 text-sm">
              {errors.dataNascimento.message}
            </p>
          )}

          <div className="my-4">
            <label className="block mb-1">Tipo Deficiência</label>
          </div>
          <Controller
            name="tipoDeficiencia"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                value={field.value}
                options={tiposDeficiencia}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Selecione o tipo de deficiência"
                className="w-full"
              />
            )}
          />
          {errors.tipoDeficiencia && (
            <p className="text-red-500 text-sm">
              {errors.tipoDeficiencia.message}
            </p>
          )}

          <div className="my-4">
            <label className="block mb-1">Grau de Dependência</label>
          </div>
          <Controller
            name="grauDependencia"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                value={field.value}
                options={grauDependencia}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Selecione o grau"
                className="w-full"
              />
            )}
          />
          {errors.grauDependencia && (
            <p className="text-red-500 text-sm">
              {errors.grauDependencia.message}
            </p>
          )}
        </div>
      </div>

      {/* Seção Responsável  */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Responsável</h2>
        <div className="">
          <div className="my-4">
            <label className="block mb-1">Nome do Responsável</label>
          </div>
          <Controller
            name="nomeResponsavel"
            control={control}
            render={({ field }) => (
              <InputText
                {...field}
                placeholder="Digite o nome"
                className="w-full"
              />
            )}
          />
          {errors.nomeResponsavel && (
            <p className="text-red-500">{errors.nomeResponsavel.message}</p>
          )}

          <div className="my-4">
            <label className="block mb-1">Telefone do Responsável</label>
          </div>
          <Controller
            name="telefoneResponsavel"
            control={control}
            render={({ field }) => (
              <InputMask
                {...field}
                mask="(99) 99999-9999"
                placeholder="(DD) XXXXX-XXXX"
                className="w-full"
              />
            )}
          />
          {errors.telefoneResponsavel && (
            <p className="text-red-500 text-sm">
              {errors.telefoneResponsavel.message}
            </p>
          )}
        </div>
      </div>

      {/* Seção Informações Adicionais */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Informações Adicionais</h2>
        <div className="">
          <Controller
            name="situacaoVulnerabilidade"
            control={control}
            render={({ field, fieldState }) => {
              const options: {
                label: string;
                value: SituacaoVulnerabilidade;
              }[] = [
                { label: "Baixa Renda", value: "baixa_renda" },
                { label: "Violência Doméstica", value: "violencia_domestica" },
                { label: "Moradia Precária", value: "moradia_precaria" },
                { label: "Desnutrição", value: "desnutricao" },
                { label: "Risco Social", value: "risco_social" },
                { label: "Outra", value: "outra" },
              ];

              return (
                <div>
                  <p className="my-4 font-medium">
                    Situação de Vulnerabilidade
                  </p>
                  {options.map((opt) => (
                    <div key={opt.value} className="flex items-center mb-1">
                      <Checkbox
                        inputId={opt.value}
                        value={opt.value}
                        onChange={(e) => {
                          let newValue: SituacaoVulnerabilidade[] = field.value
                            ? [...field.value]
                            : [];
                          if (e.checked) {
                            newValue.push(opt.value);
                          } else {
                            newValue = newValue.filter((v) => v !== opt.value);
                          }
                          field.onChange(newValue);
                        }}
                        checked={field.value?.includes(opt.value)}
                      />
                      <label htmlFor={opt.value} className="ml-2">
                        {opt.label}
                      </label>
                    </div>
                  ))}
                  {fieldState.error && (
                    <small className="p-error">
                      {fieldState.error.message}
                    </small>
                  )}
                </div>
              );
            }}
          />

          <div className="my-4">
            <label className="block mb-1">Origem do Encaminhamento</label>
          </div>
          <Controller
            name="origemEncaminhamento"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                value={field.value}
                options={origemEncaminhamento}
                onChange={(e) => field.onChange(e.value)}
                placeholder="Selecione a origem do encaminhamento"
                className="w-full"
              />
            )}
          />
          {errors.origemEncaminhamento && (
            <p className="text-red-500 text-sm">
              {errors.origemEncaminhamento.message}
            </p>
          )}
        </div>
      </div>

      {/* Documentos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Documentos</h2>

        <div className="grid grid-cols-6">
          <div className="col-start-1 col-end-3">
            <Controller
              name="laudoMedico"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <label className="block mb-1 font-medium">Laudo Médico</label>
                  <FileUpload
                    mode="basic"
                    name="file"
                    className="mb-4"
                    accept=".pdf,.jpg,.png"
                    maxFileSize={5 * 1024 * 1024} // 5MB
                    chooseLabel="Selecionar Arquivo"
                    auto={false}
                    customUpload
                    uploadHandler={() => {}} // desabilita o upload automático
                    onSelect={(e) => {
                      const file = e.files?.[0] || null;
                      field.onChange(file); // salva o arquivo no RHF
                    }}
                    onClear={() => field.onChange(null)} // se o user limpar, zera o campo
                  />
                  {fieldState.error && (
                    <small className="p-error">
                      {fieldState.error.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>

          <div className="col-span-2 col-end-7">
            <Controller
              name="comprovanteResidencia"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <label className="block mb-1 font-medium">
                    Comprovante de Residência
                  </label>
                  <FileUpload
                    mode="basic"
                    name="file"
                    className="mb-4"
                    accept=".pdf,.jpg,.png"
                    maxFileSize={5 * 1024 * 1024} // 5MB
                    chooseLabel="Selecionar Arquivo"
                    auto={false}
                    customUpload
                    uploadHandler={() => {}} // desabilita o upload automático
                    onSelect={(e) => {
                      const file = e.files?.[0] || null;
                      field.onChange(file); // salva o arquivo no RHF
                    }}
                    onClear={() => field.onChange(null)} // se o user limpar, zera o campo
                  />
                  {fieldState.error && (
                    <small className="p-error">
                      {fieldState.error.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Nome do Candidato */}
      {/* <div>
               <label className="">Nome Candidato</label> 
               <Controller
               name="nomeCandidato"
               control={control}
               render={({ field }) => (
                <InputText {...field} placeholder="Digite o nome" className="w-full" />
                )}
                />
                {errors.nomeCandidato && <p className="text-red-500">{errors.nomeCandidato.message}</p>}
            </div> */}

      {/* <div>
                <label>Data de Nascimento</label>
                <Controller
                    name="dataNascimento"
                    control={control}
                    render={({field}) => (
                        <Calendar
                        {...field}
                        value={field.value ? new Date(field.value) : null}
                        onChange={(e) => field.onChange(e.value ? e.value.toISOString().slice(0, 10) : "")}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        className="w-full"/>
                    
                    )}/>
                    {errors.dataNascimento && <p className="text-red-500 text-sm">{errors.dataNascimento.message}</p>}
            </div> */}

      {/* Nome do Responsável */}
      {/* <div>
               <label className="">Nome do Responsável</label> 
               <Controller
               name="nomeResponsavel"
               control={control}
               render={({ field }) => (
                <InputText {...field} placeholder="Digite o nome" className="w-full" />
                )}
                />
                {errors.nomeResponsavel && <p className="text-red-500">{errors.nomeResponsavel.message}</p>}
            </div> */}

      {/* Telefone Responsável */}
      {/* <div>
                <label>Telefone do Responsável</label>
                <Controller
                    name="telefoneResponsavel"
                    control={control}
                    render={({ field }) => (
                        <InputMask
                        {...field}
                        mask="(99) 99999-9999"
                        placeholder="(DD) XXXXX-XXXX"
                        className="w-full"
                        />
                    )}
                />
                {errors.telefoneResponsavel && <p className="text-red-500 text-sm">{errors.telefoneResponsavel.message}</p>}
            </div> */}

      {/* Tipos de Deficiência */}
      {/* <div>
                <label>Tipo de Deficiência:</label>
                    <Controller
                    name="tipoDeficiencia"
                    control={control}
                    render={({ field }) => (
                        <Dropdown
                        {...field}
                        value={field.value}
                        options={tiposDeficiencia}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="Selecione o tipo de deficiência"
                        className="w-full"
                        />
                    )}
                    />
                {errors.tipoDeficiencia && <p className="text-red-500 text-sm">{errors.tipoDeficiencia.message}</p>}
            </div>  */}

      {/* Grau de Dependência */}
      {/* <div>
                <label className="">Grau de Dependência</label>
                    <Controller
                    name="grauDependencia"
                    control={control}
                    render={({ field }) => (
                        <Dropdown
                        {...field}
                        value={field.value}
                        options={grauDependencia}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="Selecione o grau"
                        className="w-full"
                        />
                    )}
                    />
                {errors.grauDependencia && <p className="text-red-500 text-sm">{errors.grauDependencia.message}</p>}
            </div> */}

      {/* Situação de Vulnerabilidade */}
      {/* <div>
                <Controller
                name="situacaoVulnerabilidade"
                control={control}
                render={({ field, fieldState }) => {
                    const options: { label: string; value: SituacaoVulnerabilidade }[] = [
                      { label: "Baixa Renda", value: "baixa_renda" },
                      { label: "Violência Doméstica", value: "violencia_domestica" },
                      { label: "Moradia Precária", value: "moradia_precaria" },
                      { label: "Desnutrição", value: "desnutricao" },
                      { label: "Risco Social", value: "risco_social" },
                      { label: "Outra", value: "outra" },
                    ];

                    return (
                    <div>
                        <p className="mb-2 font-medium">Situação de Vulnerabilidade</p>
                        {options.map((opt) => (
                        <div key={opt.value} className="flex items-center mb-1">
                            <Checkbox
                            inputId={opt.value}
                            value={opt.value}
                            onChange={(e) => {
                                let newValue: SituacaoVulnerabilidade[] = field.value ? [...field.value] : [];
                                if (e.checked) {
                                    newValue.push(opt.value);
                                } else {
                                    newValue = newValue.filter((v) => v !== opt.value);
                                }
                                field.onChange(newValue);
                            }}
                            checked={field.value?.includes(opt.value)}
                            />
                            <label htmlFor={opt.value} className="ml-2">
                            {opt.label}
                            </label>
                        </div>
                        ))}
                        {fieldState.error && (
                        <small className="p-error">{fieldState.error.message}</small>
                        )}
                    </div>
                    );
                }}
                />
            </div>         */}

      {/* Laudo Médico */}
      {/* <div>
                <Controller
                name="laudoMedico"
                control={control}
                render={({field, fieldState}) => (
                    <div>
                    <label className="block mb-1 font-medium">Laudo Médico</label>
                    <FileUpload
                        mode="basic"
                        name="file"
                        accept=".pdf,.jpg,.png"
                        maxFileSize={5 * 1024 * 1024} // 5MB
                        chooseLabel="Selecionar Arquivo"
                        auto={false}
                        customUpload
                        uploadHandler={() => {}} // desabilita o upload automático
                        onSelect={(e) => {
                        const file = e.files?.[0] || null;
                        field.onChange(file); // salva o arquivo no RHF
                        }}
                        onClear={() => field.onChange(null)} // se o user limpar, zera o campo
                    />
                    {fieldState.error && (
                        <small className="p-error">{fieldState.error.message}</small>
                    )}
                    </div>
                )}
                />
            </div> */}

      {/* Origem Encaminhamento */}
      {/* <div>
                <label>Origem do Encaminhamento:</label>
                <Controller
                    name="origemEncaminhamento"
                    control={control}
                    render={({field}) => (
                        <Dropdown
                        {...field}
                        value={field.value}
                        options={origemEncaminhamento}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="Selecione a origem do encaminhamento"
                        className="w-full"/>
                    )}/>
                {errors.origemEncaminhamento && <p className="text-red-500 text-sm">{errors.origemEncaminhamento.message}</p>}
            </div> */}

      {/* Comprovante de Residencia */}
      {/* <div>
                <Controller
                name="comprovanteResidencia"
                control={control}
                render={({ field, fieldState }) => (
                    <div>
                    <label className="block mb-1 font-medium">Comprovante de Residência</label>
                    <FileUpload
                        mode="basic"
                        name="file"
                        accept=".pdf,.jpg,.png"
                        maxFileSize={5 * 1024 * 1024} // 5MB
                        chooseLabel="Selecionar Arquivo"
                        auto={false}
                        customUpload
                        uploadHandler={() => {}} // desabilita o upload automático
                        onSelect={(e) => {
                        const file = e.files?.[0] || null;
                        field.onChange(file); // salva o arquivo no RHF
                        }}
                        onClear={() => field.onChange(null)} // se o user limpar, zera o campo
                    />
                    {fieldState.error && (
                        <small className="p-error">{fieldState.error.message}</small>
                    )}
                    </div>
                )}
                />
            </div> */}

      <Button
        type="submit"
        label="Submeter"
        icon="pi pi-check"
        className="w-full"
      />
    </form>
  );
}
