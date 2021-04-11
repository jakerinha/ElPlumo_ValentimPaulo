import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, SafeAreaView, Settings } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const NivelHorizontal = ({ eixoX, animatedValue }) => {

  const animatedBackground = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ["#4baafa", "#3cd6cf", "#00eb62", "#69d755", "#d3f542"]
    //"#00eb62" "#4baafa"
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        border: 0,
        padding: 0,
        // O estilo top e left abaixo posiciona a marca do plumo conforme a posição do dispositivo móvel no eixo X
        top: ((Dimensions.get('window').height / 2) * 0.89),
        left: ((Dimensions.get('window').width / 2) * 0.9) - eixoX * 150,
        width: 36.0,
        height: 36.0,
        borderRadius: 18.0,
        backgroundColor: animatedBackground,
      }}
    />
  )

}

const NivelVertical = ({ eixoY, animatedValue }) => {

  const animatedBackground = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ["#f675fa", "#9560d6", "#2836ea", "#7aaed6", "#6cf5eb"]
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        border: 0,
        padding: 0,
        // O estilo top e left abaixo posiciona a marca do plumo conforme a posição do dispositivo móvel no eixo Y
        top: ((Dimensions.get('window').height / 2) * 0.9) + eixoY * 300,
        left: ((Dimensions.get('window').width / 2) * 0.9),
        width: 36.0,
        height: 36.0,
        borderRadius: 18.0,
        backgroundColor: animatedBackground,
      }}
    />
  )
}

export default function App() {

  const animatedValue = useRef(new Animated.Value(0)).current

  const animacao = (toValue) => Animated.timing(animatedValue, {
    toValue: toValue,
    duration: 3000,
    useNativeDriver: false
  })

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
    <SafeAreaView style={styles.container}>
      <View
        style={{
          position: 'absolute',
          border: 0,
          padding: 0,
          // O estilo top e left abaixo posiciona a marca do plumo conforme a posição do dispositivo móvel
          top: ((Dimensions.get('window').height / 2) * 0.885),
          width: 400.0,
          height: 40.0,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: 'black',
        }}
      />
      <View
        style={{
          position: 'absolute',
          border: 0,
          padding: 0,
          // O estilo top e left abaixo posiciona a marca do plumo conforme a posição do dispositivo móvel
          left: ((Dimensions.get('window').width / 2) * 0.89),
          width: 40.0,
          height: 800.0,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: 'black',
        }}
      />

      {atualizar(y) > 0 || atualizar(y) < 0 && (animacao(1).start())}
      {atualizar(x) > 0 || atualizar(x) < 0 && (animacao(1).start())}

      <NivelHorizontal eixoX={atualizar(x)} animatedValue={animatedValue} />
      <NivelVertical eixoY={atualizar(y)} animatedValue={animatedValue} />

      {atualizar(y) == 0 && (animacao(1).reset(), animacao(1).stop())}
      {atualizar(x) == 0 && (animacao(1).reset(), animacao(1).stop())}

      <Text style={styles.titulo}>
        El Plumo
      </Text>
      <Text style={styles.posicao}>
        x: {(atualizar(x) * 90).toFixed(0)}° y: {(atualizar(y) * 90).toFixed(0)}°
      </Text>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#8C7549',
  },
  titulo: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginTop: 30,
    color: 'yellow',
    fontSize: 30,
    fontWeight: 'bold',
  },
  posicao: {
    textAlign: 'left',
    textAlignVertical: 'top',
    marginTop: 10,
    fontSize: 20,
  },
});