import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import { obterConsultas, salvarConsultas, obterPacienteLogado, removerPacienteLogado } from "../services/storage";

export default function Home({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [nomePaciente, setNomePaciente] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    const paciente = await obterPacienteLogado();
    if (!paciente) return navigation.replace("Login");

    setNomePaciente(paciente.nome);
    const todasConsultas = await obterConsultas();
    // Traz apenas as consultas DESTE paciente logado
    setConsultas(todasConsultas.filter(c => c.paciente.id === paciente.id));
  }

  async function atualizarStatus(id: number, novoStatus: "confirmada" | "cancelada") {
    // Atualiza interface na hora
    setConsultas(consultas.map(c => c.id === id ? { ...c, status: novoStatus } : c));
    
    // Atualiza banco de dados
    const todasConsultas = await obterConsultas();
    await salvarConsultas(todasConsultas.map(c => c.id === id ? { ...c, status: novoStatus } : c));
  }

  function handleLogout() {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: async () => {
          await removerPacienteLogado();
          navigation.replace("Login");
        }
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Olá, {nomePaciente}!</Text>
          <Text style={styles.subtitulo}>{consultas.length} consulta(s) agendada(s)</Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity style={{ backgroundColor: "#4CAF50", padding: 16, borderRadius: 10, marginBottom: 10 }} onPress={() => navigation.navigate("Agendamento")}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>+ Agendar Nova Consulta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: 12, borderRadius: 10 }} onPress={handleLogout}>
            <Text style={{ color: "#fff", fontSize: 14, textAlign: "center" }}>Sair</Text>
          </TouchableOpacity>
        </View>

        {consultas.length === 0 ? (
           <View style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: 30, borderRadius: 15, alignItems: "center" }}>
             <Text style={{ fontSize: 40, marginBottom: 15 }}>📅</Text>
             <Text style={{ color: "#fff", fontSize: 18, textAlign: "center" }}>Você ainda não tem consultas agendadas</Text>
           </View>
        ) : (
          consultas.map((consulta) => (
            <View key={consulta.id} style={{ marginBottom: 15 }}>
              <ConsultaCard
                consulta={consulta}
                onConfirmar={() => atualizarStatus(consulta.id, "confirmada")}
                onCancelar={() => atualizarStatus(consulta.id, "cancelada")}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}