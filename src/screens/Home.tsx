<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
=======
import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
>>>>>>> 1844eda486a182039913398b870d1440818f2671

import { Especialidade } from "../types/especialidade";
import { Paciente } from "../types/paciente";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";
<<<<<<< HEAD
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";

// Chave que usaremos para salvar e recuperar no "banco de dados" local
const STORAGE_KEY = "@consultas:consulta_atual";

export default function Home() {
  const cardiologia: Especialidade = {
    id: 1,
    nome: "Cardiologia",
    descricao: "Cuidados com o coração",
  };

  const medico1: Medico = {
    id: 1,
    nome: "Dr. Roberto Silva",
    crm: "CRM12345",
    especialidade: cardiologia,
    ativo: true,
  };

  const paciente1: Paciente = {
    id: 1,
    nome: "Carlos Andrade",
    cpf: "123.456.789-00",
    email: "carlos@email.com",
    telefone: "(11) 98765-4321",
  };

  // Separamos a consulta inicial para facilitar a leitura
  const consultaInicial: Consulta = {
=======

import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles"; // <-- Importando o estilo isolado!

export default function Home() {
  const cardiologia: Especialidade = { id: 1, nome: "Cardiologia", descricao: "Cuidados com o coração" };
  const medico1: Medico = { id: 1, nome: "Dr. Roberto Silva", crm: "CRM12345", especialidade: cardiologia, ativo: true };
  const paciente1: Paciente = { id: 1, nome: "Carlos Andrade", cpf: "123.456.789-00", email: "carlos@email.com", telefone: "(11) 98765-4321" };

  const [consulta, setConsulta] = useState<Consulta>({
>>>>>>> 1844eda486a182039913398b870d1440818f2671
    id: 1,
    medico: medico1,
    paciente: paciente1,
    data: new Date(2026, 2, 10),
    valor: 350,
    status: "agendada",
    observacoes: "Consulta de rotina",
<<<<<<< HEAD
  };

  const [consulta, setConsulta] = useState<Consulta>(consultaInicial);

  // useEffect com array vazio [] executa apenas UMA vez, quando a tela abre
  useEffect(() => {
    carregarConsulta();
  }, []);

  // Busca os dados salvos no celular
  async function carregarConsulta() {
    try {
      const consultaSalva = await AsyncStorage.getItem(STORAGE_KEY);
      if (consultaSalva) {
        const consultaObjeto = JSON.parse(consultaSalva);
        // O JSON transforma a data em string, precisamos converter de volta para Date
        consultaObjeto.data = new Date(consultaObjeto.data);
        setConsulta(consultaObjeto);
      }
    } catch (erro) {
      console.error("Erro ao carregar consulta:", erro);
    }
  }

  // Salva os dados no celular
  async function salvarConsulta(consultaAtualizada: Consulta) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(consultaAtualizada) // AsyncStorage só aceita texto
      );
    } catch (erro) {
      console.error("Erro ao salvar consulta:", erro);
    }
  }

  function confirmarConsulta() {
    const consultaAtualizada = {
      ...consulta,
      status: "confirmada" as const,
    };
    setConsulta(consultaAtualizada); // Atualiza a tela
    salvarConsulta(consultaAtualizada); // Salva no celular
  }

  function cancelarConsulta() {
    const consultaAtualizada = {
      ...consulta,
      status: "cancelada" as const,
    };
    setConsulta(consultaAtualizada); // Atualiza a tela
    salvarConsulta(consultaAtualizada); // Salva no celular
=======
  });

  function confirmarConsulta() {
    setConsulta({ ...consulta, status: "confirmada" });
  }

  function cancelarConsulta() {
    setConsulta({ ...consulta, status: "cancelada" });
>>>>>>> 1844eda486a182039913398b870d1440818f2671
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
<<<<<<< HEAD
=======

>>>>>>> 1844eda486a182039913398b870d1440818f2671
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Sistema de Consultas</Text>
          <Text style={styles.subtitulo}>Consulta #{consulta.id}</Text>
        </View>
<<<<<<< HEAD
=======

>>>>>>> 1844eda486a182039913398b870d1440818f2671
        <ConsultaCard
          consulta={consulta}
          onConfirmar={confirmarConsulta}
          onCancelar={cancelarConsulta}
        />
      </ScrollView>
    </View>
  );
}