import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  obterEspecialidades, obterMedicos, salvarEspecialidades,
  salvarMedicos, obterConsultas, salvarConsultas,
} from "../services/storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Paciente } from "../types/paciente";
import { Consulta } from "../interfaces/consulta";

export default function Admin({ navigation }: any) {
  const [nomeEsp, setNomeEsp] = useState("");
  const [descEsp, setDescEsp] = useState("");
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  const [nomeMed, setNomeMed] = useState("");
  const [crmMed, setCrmMed] = useState("");
  const [medicos, setMedicos] = useState<Medico[]>([]);

  const [nomePac, setNomePac] = useState("");
  const [dataConsulta, setDataConsulta] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setEspecialidades(await obterEspecialidades());
    setMedicos(await obterMedicos());
  }

  function adicionarEspecialidade() {
    if (!nomeEsp || !descEsp) return Alert.alert("Erro", "Preencha nome e descrição");
    const novaEsp: Especialidade = { id: especialidades.length + 1, nome: nomeEsp, descricao: descEsp };
    const novasEsps = [...especialidades, novaEsp];
    setEspecialidades(novasEsps);
    salvarEspecialidades(novasEsps);
    setNomeEsp(""); setDescEsp("");
    Alert.alert("Sucesso", "Especialidade adicionada!");
  }

  function adicionarMedico() {
    if (!nomeMed || !crmMed) return Alert.alert("Erro", "Preencha nome e CRM");
    if (especialidades.length === 0) return Alert.alert("Erro", "Adicione uma especialidade primeiro!");
    const novoMed: Medico = { id: medicos.length + 1, nome: nomeMed, crm: crmMed, especialidade: especialidades[0], ativo: true };
    const novosMeds = [...medicos, novoMed];
    setMedicos(novosMeds);
    salvarMedicos(novosMeds);
    setNomeMed(""); setCrmMed("");
    Alert.alert("Sucesso", "Médico adicionado!");
  }

  async function criarConsultaTeste() {
    if (!nomePac || !dataConsulta) return Alert.alert("Erro", "Preencha paciente e data");
    if (medicos.length === 0) return Alert.alert("Erro", "Adicione um médico primeiro!");

    const pacienteTeste: Paciente = { id: 1, nome: nomePac, cpf: "123.456.789-00", email: "pac@email.com" };
    const [dia, mes, ano] = dataConsulta.split("/");
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));

    const novaConsulta: Consulta = {
      id: Date.now(), medico: medicos[0], paciente: pacienteTeste, data: data, valor: 350, status: "agendada", observacoes: "Teste"
    };

    const consultasAtuais = await obterConsultas();
    await salvarConsultas([...consultasAtuais, novaConsulta]);

    setNomePac(""); setDataConsulta("");
    Alert.alert("Sucesso", "Consulta criada!", [{ text: "OK", onPress: () => navigation.navigate("Home") }]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.content}>
        <View style={styles.secao}>
          <Text style={styles.titulo}>1. Adicionar Especialidade</Text>
          <TextInput style={styles.input} placeholder="Nome" value={nomeEsp} onChangeText={setNomeEsp} />
          <TextInput style={styles.input} placeholder="Descrição" value={descEsp} onChangeText={setDescEsp} />
          <Button title="Adicionar" onPress={adicionarEspecialidade} />
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>2. Adicionar Médico</Text>
          <TextInput style={styles.input} placeholder="Nome" value={nomeMed} onChangeText={setNomeMed} />
          <TextInput style={styles.input} placeholder="CRM" value={crmMed} onChangeText={setCrmMed} />
          <Button title="Adicionar" onPress={adicionarMedico} />
        </View>

        <View style={styles.secao}>
          <Text style={styles.titulo}>3. Criar Consulta</Text>
          <TextInput style={styles.input} placeholder="Paciente" value={nomePac} onChangeText={setNomePac} />
          <TextInput style={styles.input} placeholder="Data (DD/MM/AAAA)" value={dataConsulta} onChangeText={setDataConsulta} />
          <Button title="Criar" onPress={criarConsultaTeste} color="#9C27B0" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { flex: 1, padding: 20 },
  secao: { backgroundColor: "#fff", padding: 20, borderRadius: 8, marginBottom: 20 },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 15 },
  input: { backgroundColor: "#f5f5f5", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 10 }
});