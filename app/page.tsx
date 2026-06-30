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
        setUserData({ ...userData, certType: 'Fuente', certTypeId: 'fuente' });
        response = `Perfecto, certificado de Retención en la Fuente.\n\n¿Qué período deseas?\n\nEj: 01/01/2026 a 30/06/2026`;
        setStep('dates');
      } else if (input === '2' || input.toLowerCase().includes('iva')) {
        setUserData({ ...userData, certType: 'IVA', certTypeId: 'iva' });
        response = `Perfecto, certificado de Retención IVA.\n\nIndica el rango de fechas (bimestral):\n\nEj: 01/01/2026 a 29/02/2026`;
        setStep('dates');
      } else if (input === '3' || input.toLowerCase().includes('ica')) {
        setUserData({ ...userData, certType: 'ICA', certTypeId: 'ica' });
        response = `Perfecto, certificado de Retención ICA.\n\nIndica el rango de fechas:\n\nEj: 01/06/2026 a 30/06/2026`;
        setStep('dates_ica');
      } else {
        response = '❌ Opción no válida.\n\nElige:\n1️⃣ Fuente\n2️⃣ IVA\n3️⃣ ICA';
      }
    } else if (step === 'dates' || step === 'dates_ica') {
      const fechas = input.split('a').map(f => f.trim());
      if (fechas.length === 2) {
        setUserData({ ...userData, fecha_inicio: fechas[0], fecha_fin: fechas[1] });
        if (step === 'dates_ica') {
          response = `Fechas registradas: ${fechas[0]} a ${fechas[1]}\n\nAhora, ¿cuál es el período?\n\n1️⃣ Mensual\n2️⃣ Bimestral\n3️⃣ Trimestral\n4️⃣ Anual`;
          setStep('period_ica');
        } else {
          response = `✓ Fechas confirmadas: ${fechas[0]} a ${fechas[1]}\n\nResumen de tu solicitud:\n\nNIT: ${userData.nit}\nProveedor: ${userData.nombre}\nCertificado: ${userData.certType}\nPeríodo: ${fechas[0]} a ${fechas[1]}\n\n¿Confirmas? (sí/no)`;
          setStep('confirm');
        }
      } else {
        response = '❌ Formato incorrecto.\n\nUsa: 01/06/2026 a 30/06/2026';
      }
    } else if (step === 'period_ica') {
      const periods = { '1': 'Mensual', '2': 'Bimestral', '3': 'Trimestral', '4': 'Anual' };
      const selectedPeriod = periods[input] || (Object.values(periods).includes(input) ? input : null);
      
      if (selectedPeriod) {
        setUserData({ ...userData, period: selectedPeriod });
        response = `✓ Período: ${selectedPeriod}\n\nResumen de tu solicitud:\n\nNIT: ${userData.nit}\nProveedor: ${userData.nombre}\nCertificado: ${userData.certType}\nPeríodo: ${userData.fecha_inicio} a ${userData.fecha_fin}\nTipo: ${selectedPeriod}\n\n¿Confirmas? (sí/no)`;
        setStep('confirm');
      } else {
        response = '❌ Opción no válida.\n\nElige:\n1️⃣ Mensual\n2️⃣ Bimestral\n3️⃣ Trimestral\n4️⃣ Anual';
      }
    } else if (step === 'confirm') {
      if (input.toLowerCase().startsWith('s')) {
        response = `✅ ¡Solicitud generada correctamente!\n\n📄 Certificado: ${userData.certType}\nNIT: ${userData.nit}\n\n📧 El certificado será enviado al correo registrado en UNIBOL\n\n¿Necesitas otro certificado? (sí/no)`;
        setStep('otro');
      } else if (input.toLowerCase().startsWith('n')) {
        response = `❌ Solicitud cancelada.\n\n¿Deseas intentar de nuevo? (sí/no)`;
        setStep('otro');
      } else {
        response = '❌ Respuesta no válida.\n\nResponde: sí o no';
      }
    } else if (step === 'otro') {
      if (input.toLowerCase().startsWith('s')) {
        setMessages([{ type: 'bot', text: '¡Hola 👋 Bienvenido a UNIBOL Certificados Tributarios!\n\n¿Cuál es tu NIT?' }]);
        setStep('nit');
        setUserData({});
        return;
      } else {
        response = '👋 Gracias por usar UNIBOL Certificados.\n\n¡Hasta luego!';
        setStep('fin');
      }
    }

    setMessages(prev => [...prev, { type: 'bot', text: response }]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        width: '100%',
        maxWidth: '500px',
        background: '#f5f5f5',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          background: '#d32f2f',
          color: '#fff',
          padding: '1rem',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '16px'
        }}>
          UNIBOL - Certificados Tributarios
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px'
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '14px',
                lineHeight: '1.5',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                background: msg.type === 'user' ? '#007bff' : '#e9ecef',
                color: msg.type === 'user' ? '#fff' : '#1a1a1a'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: '#e9ecef',
                color: '#1a1a1a',
                fontSize: '14px'
              }}>
                Escribiendo...
              </div>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px',
          background: '#fff',
          borderTop: '1px solid #e0e0e0'
        }}>
          <input
            type="text"
            placeholder="Escribe tu respuesta..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              border: '1px solid #d0d0d0',
              borderRadius: '24px',
              padding: '10px 16px',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none'
            }}
            disabled={loading || step === 'fin'}
          />
          <button
            onClick={handleSendMessage}
            style={{
              background: '#d32f2f',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 600,
              opacity: loading || step === 'fin' ? 0.5 : 1
            }}
            disabled={loading || step === 'fin'}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}