'use client'

import React, { useState, useRef, useEffect } from 'react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: '¡Hola 👋 Bienvenido a UNIBOL Certificados Tributarios!\n\n¿Cuál es tu NIT?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [step, setStep] = useState('nit');
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const vendorData = {
    "19297684": { nombre: "EMPRESA PARA PROYECTO IA", docs: 1 },
    "57290736": { nombre: "EMPRESA PARA PROYECTO IA", docs: 1 },
    "72187909": { nombre: "EMPRESA PARA PROYECTO IA", docs: 1 },
    "72225516": { nombre: "EMPRESA PARA PROYECTO IA", docs: 1 },
    "8000081512": { nombre: "EMPRESA PARA PROYECTO IA", docs: 11 },
    "8000586072": { nombre: "EMPRESA PARA PROYECTO IA", docs: 3 },
    "8000625919": { nombre: "EMPRESA PARA PROYECTO IA", docs: 9 },
    "8000667787": { nombre: "EMPRESA PARA PROYECTO IA", docs: 9 },
    "8000669049": { nombre: "EMPRESA PARA PROYECTO IA", docs: 2 },
    "8000767719": { nombre: "EMPRESA PARA PROYECTO IA", docs: 1 },
    "8001016130": { nombre: "EMPRESA PARA PROYECTO IA", docs: 4 },
    "8001214756": { nombre: "EMPRESA PARA PROYECTO IA", docs: 1 },
    "8001343715": { nombre: "EMPRESA PARA PROYECTO IA", docs: 3 },
    "800145020": { nombre: "EMPRESA PARA PROYECTO IA", docs: 35 },
    "8001578478": { nombre: "EMPRESA PARA PROYECTO IA", docs: 8 },
    "8001719291": { nombre: "EMPRESA PARA PROYECTO IA", docs: 105 },
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessage = { type: 'user', text: userInput };
    setMessages([...messages, newMessage]);
    setUserInput('');
    setLoading(true);
    setTimeout(() => {
      procesarMensaje(userInput);
      setLoading(false);
    }, 500);
  };

  const procesarMensaje = (input) => {
    let response = '';
    if (step === 'nit') {
      const nit = input.trim();
      if (vendorData[nit]) {
        setUserData({ nit, ...vendorData[nit] });
        response = `✓ Encontré el proveedor:\n\n${vendorData[nit].nombre}\nDocumentos: ${vendorData[nit].docs}\n\nAhora, ¿qué tipo de certificado necesitas?\n\n1️⃣ Retención en la Fuente (anual)\n2️⃣ Retención IVA (bimestral)\n3️⃣ Retención ICA (flexible)`;
        setStep('cert_type');
      } else {
        response = '❌ NIT no encontrado.\n\nIntenta con otro NIT. Ej: 8000081512';
      }
    } else if (step === 'cert_type') {
      if (input === '1' || input.toLowerCase().includes('fuente')) {
        setUserData({ ...userData, certType: 'Fuente' });
        response = `Perfecto, certificado de Retención en la Fuente.\n\n¿Qué período deseas?\n\nEj: 01/01/2026 a 30/06/2026`;
        setStep('dates');
      } else if (input === '2' || input.toLowerCase().includes('iva')) {
        setUserData({ ...userData, certType: 'IVA' });
        response = `Perfecto, certificado de Retención IVA.\n\nIndica el rango de fechas:\n\nEj: 01/01/2026 a 29/02/2026`;
        setStep('dates');
      } else if (input === '3' || input.toLowerCase().includes('ica')) {
        setUserData({ ...userData, certType: 'ICA' });
        response = `Perfecto, certificado de Retención ICA.\n\nIndica el rango de fechas:\n\nEj: 01/06/2026 a 30/06/2026`;
        setStep('dates_ica');
      } else {
        response = '❌ Opción no válida.\n\nElige: 1, 2 o 3';
      }
    } else if (step === 'dates' || step === 'dates_ica') {
      const fechas = input.split('a').map(f => f.trim());
      if (fechas.length === 2) {
        setUserData({ ...userData, fecha_inicio: fechas[0], fecha_fin: fechas[1] });
        if (step === 'dates_ica') {
          response = `Fechas: ${fechas[0]} a ${fechas[1]}\n\n¿Período?\n1️⃣ Mensual\n2️⃣ Bimestral\n3️⃣ Trimestral\n4️⃣ Anual`;
          setStep('period_ica');
        } else {
          response = `✓ Confirmado\n\nNIT: ${userData.nit}\nCertificado: ${userData.certType}\nPeríodo: ${fechas[0]} a ${fechas[1]}\n\n¿Confirmas? (sí/no)`;
          setStep('confirm');
        }
      } else {
        response = '❌ Usa: 01/06/2026 a 30/06/2026';
      }
    } else if (step === 'period_ica') {
      const periods = { '1': 'Mensual', '2': 'Bimestral', '3': 'Trimestral', '4': 'Anual' };
      const selectedPeriod = periods[input];
      if (selectedPeriod) {
        setUserData({ ...userData, period: selectedPeriod });
        response = `✓ ${selectedPeriod}\n\n¿Confirmas? (sí/no)`;
        setStep('confirm');
      } else {
        response = '❌ Elige 1, 2, 3 o 4';
      }
    } else if (step === 'confirm') {
      if (input.toLowerCase().startsWith('s')) {
        response = `✅ ¡Solicitud generada!\n\n📄 ${userData.certType}\nNIT: ${userData.nit}\n\n📧 Se enviará por email\n\n¿Otro? (sí/no)`;
        setStep('otro');
      } else {
        response = '❌ Cancelado. ¿Intentar de nuevo? (sí/no)';
        setStep('otro');
      }
    } else if (step === 'otro') {
      if (input.toLowerCase().startsWith('s')) {
        setMessages([{ type: 'bot', text: '¡Hola 👋 Bienvenido a UNIBOL Certificados Tributarios!\n\n¿Cuál es tu NIT?' }]);
        setStep('nit');
        setUserData({});
        return;
      } else {
        response = '👋 Gracias. ¡Hasta luego!';
        setStep('fin');
      }
    }
    setMessages(prev => [...prev, { type: 'bot', text: response }]);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '600px', width: '100%', maxWidth: '500px', background: '#f5f5f5', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <div style={{ background: '#d32f2f', color: '#fff', padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '16px' }}>
          UNIBOL - Certificados Tributarios
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap', background: msg.type === 'user' ? '#007bff' : '#e9ecef', color: msg.type === 'user' ? '#fff' : '#1a1a1a' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#e9ecef', fontSize: '14px' }}>Escribiendo...</div>}
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '12px', background: '#fff', borderTop: '1px solid #e0e0e0' }}>
          <input type="text" placeholder="Respuesta..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, border: '1px solid #d0d0d0', borderRadius: '24px', padding: '10px 16px', fontSize: '14px' }} disabled={loading || step === 'fin'} />
          <button onClick={handleSendMessage} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '18px' }} disabled={loading || step === 'fin'}>➤</button>
        </div>
      </div>
    </div>
  );
}