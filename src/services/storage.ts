import AsyncStorage from "@react-native-async-storage/async-storage";
import { Especialidade } from "../types/especialidade";
import { Medico } from "../interfaces/medico";
import { Consulta } from "../interfaces/consulta";
import { Paciente } from "../types/paciente";
import { especialidadesIniciais, medicosIniciais, pacientesIniciais } from "../data/seedData";

const KEYS = {
  ESPECIALIDADES: "@consultas:especialidades",
  MEDICOS: "@consultas:medicos",
  CONSULTAS: "@consultas:consultas",
  PACIENTE_LOGADO: "@consultas:pacienteLogado",
  PACIENTES: "@consultas:pacientes",
};

// ... (MANTENHA AQUI SUAS FUNÇÕES ANTIGAS DE obter/salvar Especialidades, Medicos e Consultas) ...

// ========== PACIENTES E AUTENTICAÇÃO ==========

export async function salvarPacientes(pacientes: Paciente[]) {
  try { await AsyncStorage.setItem(KEYS.PACIENTES, JSON.stringify(pacientes)); } 
  catch (erro) { console.error("Erro ao salvar pacientes:", erro); }
}

export async function obterPacientes(): Promise<Paciente[]> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.PACIENTES);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) { return []; }
}

export async function salvarPacienteLogado(paciente: Paciente) {
  try { await AsyncStorage.setItem(KEYS.PACIENTE_LOGADO, JSON.stringify(paciente)); } 
  catch (erro) { console.error("Erro ao logar:", erro); }
}

export async function obterPacienteLogado(): Promise<Paciente | null> {
  try {
    const dados = await AsyncStorage.getItem(KEYS.PACIENTE_LOGADO);
    return dados ? JSON.parse(dados) : null;
  } catch (erro) { return null; }
}

export async function removerPacienteLogado() {
  try { await AsyncStorage.removeItem(KEYS.PACIENTE_LOGADO); } 
  catch (erro) { console.error("Erro no logout:", erro); }
}

// ========== INICIALIZAÇÃO (O "Big Bang" do seu App) ==========
export async function inicializarDados() {
  try {
    const especialidades = await obterEspecialidades();
    if (especialidades.length === 0) await salvarEspecialidades(especialidadesIniciais);

    const medicos = await obterMedicos();
    if (medicos.length === 0) await salvarMedicos(medicosIniciais);

    const pacientes = await obterPacientes();
    if (pacientes.length === 0) await salvarPacientes(pacientesIniciais);
  } catch (erro) {
    console.error("Erro ao inicializar dados:", erro);
  }
}