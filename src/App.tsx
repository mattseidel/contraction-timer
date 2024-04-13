import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import moment from 'moment';

interface Contraction {
  start: Date;
  end: Date;
  duration: string;
}

const ContractionsCalculator: React.FC = () => {
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [currentContractionStart, setCurrentContractionStart] = useState<Date | null>(null);
  const [intervalTime, setIntervalTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gettingLastTenMinutes, setGettingLastTenMinutes] = useState(false)


  const LastTenMinutes = (date: Date): boolean => {
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
    return date.getTime() > tenMinutesAgo.getTime();
  };



  useEffect(() => {
    let intervalo: number;
    if (isRunning) {
      intervalo = setInterval(() => {
        setIntervalTime((prevIntervalTime) => prevIntervalTime + 1000);
      }, 1000);
    }

    return () => {
      window.clearInterval(intervalo);
    }
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
    setCurrentContractionStart(new Date());
  };

  const stopTimer = () => {
    setIsRunning(false);
    const currentContractionEnd = new Date();
    const duration = calculateDuration(currentContractionStart!, currentContractionEnd);
    setContractions([...contractions, {
      start: currentContractionStart!,
      end: currentContractionEnd,
      duration
    }]);
    setCurrentContractionStart(null);
    setIntervalTime(0);
  };


  const calculateDuration = (start: Date, end: Date): string => {
    const durationInSeconds = (end.getTime() - start.getTime()) / 1000;
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateAverage = (): string => {
    if (contractions.length < 2) {
      return 'No hay suficientes contracciones para calcular el promedio.';
    }

    let totalDuration = 0;
    contractions.forEach((contraction) => {
      const durationInSeconds = (contraction.end.getTime() - contraction.start.getTime()) / 1000;
      totalDuration += durationInSeconds;
    });

    const averageSeconds = totalDuration / contractions.length;
    const averageMinutes = Math.floor(averageSeconds / 60);
    const remainingSeconds = Math.round(averageSeconds % 60);

    return `${averageMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-gray-200'>

    <div className='flex flex-grow'>

        <section className='container mx-auto p-6 my-4 bg-gray-800 rounded-lg shadow-md'>
            <h1 className="text-4xl font-semibold mb-8 text-purple-300 text-center">Calculadora de Contracciones</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="flex flex-col justify-center items-center">
                    <div className="mb-8 grid grid-cols-2 gap-4">
                        {!isRunning ? (
                            <button className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 cursor-pointer" onClick={startTimer}>Iniciar Contracción</button>
                        ) : (
                            <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 cursor-pointer" onClick={stopTimer}>Finalizar Contracción</button>
                        )}

                        <button
                            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 cursor-pointer"
                            onClick={() => setGettingLastTenMinutes(!gettingLastTenMinutes)}
                        >
                            {gettingLastTenMinutes ? 'Ocultar' : 'Mostrar'} últimos 10 minutos
                        </button>

                        {isRunning && (
                            <p className="mt-6 col-span-2 text-center">Tiempo transcurrido: <span className="font-semibold">{moment.utc(intervalTime).format('mm:ss')}</span></p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-2xl font-semibold mb-6 text-purple-300">Historial de Contracciones</h2>
                    <ul className="mb-6">
                        {gettingLastTenMinutes ? MostrarContracciones(contractions.filter(contraction => LastTenMinutes(contraction.start))) : MostrarContracciones(contractions)}
                    </ul>

                    {contractions.length > 1 && (
                        <p className="mb-6">Promedio de duración de contracciones: <span className="font-semibold">{calculateAverage()}</span></p>
                    )}
                </div>
            </div>
        </section>
    </div>

    <div className="text-center mt-8 pt-4 border-t bg-gray-800 border-gray-700">
        <p className="text-sm">Creado por Matthew Seidel</p>
        <p className="text-sm">Revisado por el médico Erick Seidel</p>
    </div>
</div>


  );
};

const MostrarContracciones = (contractions: Contraction[]) => {
  return (
    <ul className="mb-4">
    {contractions.map((contraction, index) => (
        <li key={index} className="font-semibold text-gray-300 text-sm md:text-lg">
            Inicio: <Moment format="HH:mm:ss" className="text-purple-300">{contraction.start}</Moment> -
            Fin: <Moment format="HH:mm:ss" className="text-purple-300">{contraction.end}</Moment> -
            Duración: <span className="font-semibold text-purple-300">{contraction.duration}</span>
        </li>
    ))}
    <p className='mt-4 font-semibold text-purple-300'>Cantidad de contracciones: <span className="text-blue-500">{contractions.length}</span></p>
</ul>

  );
}

export default ContractionsCalculator;
