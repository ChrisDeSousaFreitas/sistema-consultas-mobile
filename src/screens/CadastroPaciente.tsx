import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { obterPacientes, salvarPacientes, salvarPacienteLogado, obterPacienteLogado } from "../services/storage";
import { Paciente } from "../types/paciente";

export default function CadastroPaciente({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [etapa, setEtapa] = useState<"cpf" | "cadastro">("cpf");
  const [verificando, setVerificando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const pacienteLogado = await obterPacienteLogado();
      if (pacienteLogado) {
        navigation.replace("Home");
        return;
      }
      setEtapa("cpf"); setCpf(""); setNome(""); setEmail(""); setTelefone(""); setErro(""); setVerificando(false);
    });
    return unsubscribe;
  }, [navigation]);

  function validarCPF(cpf: string) {
    return cpf.replace(/\D/g, "").length === 11;
  }

  async function verificarCPF() {
    setErro("");
    if (!validarCPF(cpf)) return Alert.alert("Erro", "CPF deve ter 11 dígitos");

    try {
      setVerificando(true);
      const pacientes = await obterPacientes();
      const pacienteExistente = pacientes.find(p => p.cpf.replace(/\D/g, "") === cpf.replace(/\D/g, ""));
      
      if (pacienteExistente) {
        await salvarPacienteLogado(pacienteExistente);
        navigation.replace("Home");
      } else {
        setErro("CPF não encontrado. Faça seu cadastro.");
      }
    } catch (erro) {
      Alert.alert("Erro", "Falha ao verificar CPF");
    } finally { setVerificando(false); }
  }

  async function completarCadastro() {
    if (!nome.trim() || !email.trim()) return Alert.alert("Erro", "Preencha nome e email");

    try {
      setVerificando(true);
      const novoPaciente: Paciente = { id: Date.now(), nome: nome.trim(), cpf: cpf.trim(), email: email.trim(), telefone: telefone.trim() || undefined };
      const pacientes = await obterPacientes();
      await salvarPacientes([...pacientes, novoPaciente]);
      await salvarPacienteLogado(novoPaciente);
      navigation.replace("Home");
    } catch (erro) {
      Alert.alert("Erro", "Falha no cadastro");
    } finally { setVerificando(false); }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.subtitulo}>{etapa === "cpf" ? "Informe seu CPF para entrar" : "Complete seu cadastro"}</Text>
        </View>

        <View style={styles.form}>
          {etapa === "cpf" && (
            <>
              <TextInput style={styles.input} placeholder="CPF (somente números)" value={cpf} onChangeText={(t) => { setCpf(t); setErro(""); }} keyboardType="numeric" maxLength={14} editable={!verificando} />
              <TouchableOpacity style={[styles.botao, verificando && styles.botaoDesabilitado]} onPress={verificarCPF} disabled={verificando}>
                <Text style={styles.botaoTexto}>{verificando ? "Verificando..." : "Continuar"}</Text>
              </TouchableOpacity>
              
              {erro ? (
                <View style={styles.erroContainer}>
                  <Text style={styles.erroTexto}>{erro}</Text>
                  <TouchableOpacity onPress={() => setEtapa("cadastro")}><Text style={styles.linkTexto}>Fazer cadastro agora</Text></TouchableOpacity>
                </View>
              ) : null}
            </>
          )}

          {etapa === "cadastro" && (
            <>
              <TextInput style={[styles.input, styles.inputDesabilitado]} value={cpf} editable={false} />
              <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} editable={!verificando} />
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!verificando} />
              <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" editable={!verificando} />
              
              <TouchableOpacity style={[styles.botao, verificando && styles.botaoDesabilitado]} onPress={completarCadastro} disabled={verificando}>
                <Text style={styles.botaoTexto}>{verificando ? "Cadastrando..." : "Finalizar Cadastro"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEtapa("cpf")} style={{marginTop: 15}}><Text style={styles.linkTexto}>← Voltar</Text></TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#79059C" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  header: { alignItems: "center", marginBottom: 40 },
  titulo: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitulo: { fontSize: 16, color: "#e0e0e0", marginTop: 5 },
  form: { backgroundColor: "#fff", padding: 20, borderRadius: 16, elevation: 5 },
  input: { backgroundColor: "#f5f5f5", padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#e0e0e0" },
  inputDesabilitado: { backgroundColor: "#e0e0e0", color: "#666" },
  botao: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 8, alignItems: "center" },
  botaoDesabilitado: { backgroundColor: "#A5D6A7" },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  erroContainer: { marginTop: 15, alignItems: "center" },
  erroTexto: { color: "#F44336", marginBottom: 10, textAlign: "center" },
  linkTexto: { color: "#79059C", fontWeight: "bold", textAlign: "center" }
});