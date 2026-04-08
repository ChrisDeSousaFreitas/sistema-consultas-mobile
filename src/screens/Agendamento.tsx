import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from "react-native";
import { obterEspecialidades, obterMedicos, obterPacienteLogado, obterConsultas, salvarConsultas } from "../services/storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";

export default function Agendamento({ navigation }: any) {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState<Medico[]>([]);
  const [espSelecionada, setEspSelecionada] = useState<Especialidade | null>(null);
  const [medSelecionado, setMedSelecionado] = useState<Medico | null>(null);
  const [dataConsulta, setDataConsulta] = useState("");

  useEffect(() => {
    async function load() {
      setEspecialidades(await obterEspecialidades());
      setMedicos(await obterMedicos());
    }
    load();
  }, []);

  function selecionarEspecialidade(esp: Especialidade) {
    setEspSelecionada(esp);
    setMedSelecionado(null);
    setMedicosFiltrados(medicos.filter((m) => m.especialidade.id === esp.id));
  }

  async function agendarConsulta() {
    if (!espSelecionada || !medSelecionado || !dataConsulta) return Alert.alert("Atenção", "Preencha todos os campos");
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataConsulta)) return Alert.alert("Erro", "Formato: DD/MM/AAAA");

    try {
      const paciente = await obterPacienteLogado();
      if (!paciente) return navigation.replace("Login");

      const [dia, mes, ano] = dataConsulta.split("/");
      const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
      
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
      if (data < hoje) return Alert.alert("Erro", "A data não pode estar no passado");

      const novaConsulta: Consulta = {
        id: Date.now(), medico: medSelecionado, paciente, data, valor: 350, status: "agendada", observacoes: "Agendado via app"
      };

      const consultas = await obterConsultas();
      await salvarConsultas([...consultas, novaConsulta]);
      
      Alert.alert("Sucesso!", `Consulta agendada com ${medSelecionado.nome} para ${dataConsulta}`, [
        { text: "Ver minhas consultas", onPress: () => navigation.navigate("Home") }
      ]);
      
      setEspSelecionada(null); setMedSelecionado(null); setDataConsulta(""); setMedicosFiltrados([]);
    } catch (erro) {
      Alert.alert("Erro", "Falha ao agendar a consulta");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>1. Selecione a Especialidade</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {especialidades.map(esp => (
          <TouchableOpacity key={esp.id} style={[styles.chip, espSelecionada?.id === esp.id && styles.chipAtivo]} onPress={() => selecionarEspecialidade(esp)}>
            <Text style={[styles.chipText, espSelecionada?.id === esp.id && styles.chipTextAtivo]}>{esp.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {espSelecionada && (
        <>
          <Text style={styles.title}>2. Selecione o Médico</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {medicosFiltrados.map(med => (
              <TouchableOpacity key={med.id} style={[styles.chip, medSelecionado?.id === med.id && styles.chipAtivo]} onPress={() => setMedSelecionado(med)}>
                <Text style={[styles.chipText, medSelecionado?.id === med.id && styles.chipTextAtivo]}>{med.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {medSelecionado && (
        <>
          <Text style={styles.title}>3. Data da Consulta</Text>
          <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={dataConsulta} onChangeText={setDataConsulta} keyboardType="numeric" maxLength={10} />
          <TouchableOpacity style={styles.botao} onPress={agendarConsulta}><Text style={styles.botaoTexto}>Confirmar Agendamento</Text></TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "#333" },
  horizontalScroll: { flexDirection: "row", paddingBottom: 10 },
  chip: { backgroundColor: "#e0e0e0", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  chipAtivo: { backgroundColor: "#79059C" },
  chipText: { color: "#333" },
  chipTextAtivo: { color: "#fff", fontWeight: "bold" },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", marginBottom: 20 },
  botao: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 8, alignItems: "center" },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});