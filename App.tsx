import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

// Importando o NOVO componente
import ConsultaCard from "./src/components/ConsultaCard";

// Importando os tipos globais
import { Especialidade } from "./src/types/especialidade";
import { Paciente } from "./src/types/paciente";
import { Medico } from "./src/interfaces/medico";
import { Consulta } from "./src/interfaces/consulta";

export default function App() {
  const cardiologia: Especialidade = { id: 1, nome: "Cardiologia", descricao: "Cuidados com o coração" };
  const medico1: Medico = { id: 1, nome: "Dr. Roberto Silva", crm: "CRM12345", especialidade: cardiologia, ativo: true };
  const paciente1: Paciente = { id: 1, nome: "Carlos Andrade", cpf: "123.456.789-00", email: "carlos@email.com", telefone: "(11) 98765-4321" };

  const [consulta, setConsulta] = useState<Consulta>({
    id: 1,
    medico: medico1,
    paciente: paciente1,
    data: new Date(2026, 2, 10),
    valor: 350,
    status: "agendada",
    observacoes: "Consulta de rotina",
  });

  function confirmarConsulta() {
    setConsulta({ ...consulta, status: "confirmada" });
  }

  function cancelarConsulta() {
    setConsulta({ ...consulta, status: "cancelada" });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Sistema de Consultas</Text>
          <Text style={styles.subtitulo}>Consulta #{consulta.id}</Text>
        </View>

        {/* COMPONENTIZAÇÃO NA PRÁTICA! Tudo se resume a isso: */}
        <ConsultaCard
          consulta={consulta}
          onConfirmar={confirmarConsulta}
          onCancelar={cancelarConsulta}
        />

      </ScrollView>
    </View>
  );
}

// O App.tsx agora só tem os estilos gerais do fundo da tela
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#79059C" },
  scrollContent: { padding: 20, paddingTop: 40 },
  header: { alignItems: "center", marginBottom: 24 },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitulo: { fontSize: 18, color: "#fff", opacity: 0.9 },
});