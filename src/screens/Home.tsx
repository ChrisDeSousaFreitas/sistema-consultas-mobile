import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Consulta } from "../interfaces/consulta";
import { ConsultaCard } from "../components";
import { styles } from "../styles/app.styles";
import { obterConsultas, salvarConsultas } from "../services/storage";

export default function Home({ navigation }: any) {
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  // Atualiza a lista SEMPRE que a tela for focada (mesmo voltando do Admin)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarConsultas();
    });
    return unsubscribe;
  }, [navigation]);

  async function carregarConsultas() {
    setConsultas(await obterConsultas());
  }

  async function confirmarConsulta(consultaId: number) {
    const atualizadas = consultas.map((c) =>
      c.id === consultaId ? { ...c, status: "confirmada" as const } : c
    );
    setConsultas(atualizadas);
    await salvarConsultas(atualizadas);
  }

  async function cancelarConsulta(consultaId: number) {
    const atualizadas = consultas.map((c) =>
      c.id === consultaId ? { ...c, status: "cancelada" as const } : c
    );
    setConsultas(atualizadas);
    await salvarConsultas(atualizadas);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas Consultas</Text>
          <Text style={styles.subtitulo}>{consultas.length} agendada(s)</Text>
        </View>

        {consultas.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#fff", marginBottom: 20 }}>Nenhuma consulta agendada</Text>
            <Button title="Ir para Painel Admin" onPress={() => navigation.navigate("Admin")} color="#FFA500" />
          </View>
        ) : (
          <View>
            <Button title="+ Nova Consulta (Admin)" onPress={() => navigation.navigate("Admin")} color="#FFA500" />
            <View style={{ height: 20 }}/>
            {consultas.map((consulta) => (
              <View key={consulta.id} style={{ marginBottom: 15 }}>
                <ConsultaCard
                  consulta={consulta}
                  onConfirmar={() => confirmarConsulta(consulta.id)}
                  onCancelar={() => cancelarConsulta(consulta.id)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}