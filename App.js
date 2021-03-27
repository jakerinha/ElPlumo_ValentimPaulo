import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
  });
  const [subscription, habilitarUso] = useState(null);
  
  // As função abaixo habilita o uso do acelerometro
  const _habilitar = () => {
    habilitarUso(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
  };

  //A funçãos abaixo desabilita o acelerômetro
  const _desabilitar
   = () => {
    subscription && subscription.remove();
    habilitarUso(null);
  };

  //A função abaixo atualiza a posição
  useEffect(() => {
    _habilitar();
    return () => _desabilitar
    ();
  }, []);

  //A função abaixo atualiza os valores de x, y conforme a posição do acelerômetro
function atualizar(valor) {
  if (!valor) {
    return 0;
  }
  return Math.floor(valor * 100) / 100;
}

  const { x, y } = data;
  return (
    <View style={styles.container}>
      <View
          style={{
            position: 'absolute',
            border: 0,
            padding: 0,
            // O estilo top e left abaixo posiciona a marca do plumo conforme a posição do dispositivo móvel
            top: ((Dimensions.get('window').height / 2)*0.885),
            left: ((Dimensions.get('window').width / 2)*0.873),
            width: 40.0,
            height: 40.0,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 20.0,
            backgroundColor: 'lightblue',
          }}
        />
      <View
          style={{
            position: 'absolute',
            border: 0,
            padding: 0,
            // O estilo top e left abaixo posiciona a marca do plumo conforme a posição do dispositivo móvel
            top: ((Dimensions.get('window').height / 2)*0.9) + atualizar(y) * 300,
            left: ((Dimensions.get('window').width / 2)*0.9) - atualizar(x) * 150,
            width: 30.0,
            height: 30.0,
            borderRadius: 15.0,
            backgroundColor: 'white',
          }}
        />        
      <Text style={styles.titulo}>
        El Plumo
      </Text>
      <Text style={styles.posicao}>
        x: {(atualizar(x) * 90).toFixed(0)}° y: {(atualizar(y) * 90).toFixed(0)}°
      </Text>      
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'darkturquoise',
  },
  titulo: {
    textAlign: 'center',
    textAlignVertical: 'top',
    marginTop: 30,
    color: 'yellow',
    fontSize: 30,
    fontWeight: 'bold',
  },
  posicao: {
    textAlign: 'center',
    textAlignVertical: 'top',
    marginTop: 10,
    fontSize: 20,
  },  
});