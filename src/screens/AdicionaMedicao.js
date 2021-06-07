import React, { useState } from 'react'
import { View, Text, Image, Alert, StyleSheet } from 'react-native'
import { withTheme, Caption, TextInput, Button, FAB, Snackbar } from 'react-native-paper'
import { BACKEND } from '../constants'

function AdicionaMedicao({ navigation, route }) {

    const { data } = route.params

    const [medidaX, setMedidaX] = (data._id === null ? useState(String(data.x)) : useState(data.medidas.medidaX))

    //const [medidaX, setMedidaX] = useState(data.x)
    //const [medidaY, setMedidaY] = useState(data.y)
    

    const [medidaY, setMedidaY] = (data._id === null ? useState(String(data.y)) : useState(data.medidas.medidaY))

    const [nomeCliente, setNomeCliente] = useState(data.nomeCliente)

    const [localMedida, setLocalMedida] = useState(data.localMedida)

    const [salvandoMedicao, setSalvandoMedicao] = useState(false)

    const [erros, setErros] = useState(false)

    const [aviso, setAviso] = useState('')

    async function salvaMedicao() {
        const novosErros = validaErrosMedida()

        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros)
        } else {
            const metodo = data._id === null ? 'POST' : 'PUT'

            let date = new Date()

            let dia = String(date.getDay()).padStart(2, '0')
            let mes = String(date.getMonth() + 1).padStart(2, '0')
            let ano = date.getFullYear()

            let dataAtual = dia + '/' + mes + '/' + ano

            let medicao = { medidas:{medidaX:Number(medidaX), medidaY:Number(medidaY)}, nomeCliente: nomeCliente, localMedida: localMedida, dataMedicao: dataAtual, _id: data._id }

            setSalvandoMedicao(true)

            let url = `${BACKEND}/medicoes`

            await fetch(url, {
                mode: 'cors',
                method: metodo,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medicao)
            }).then(response => response.json())
                .then(data => {
                    (data._id || data.message) ? setAviso('Registro Salvo Com Sucesso!') : setAviso('')
                    setNomeCliente('')
                    setLocalMedida('')
                })
                .catch(function (error) {
                    setAviso('Não foi possível salvar o registro')
                    console.error('Houve um problema ao salvar as medidas: ' + error.message);
                })
            setSalvandoMedicao(false)
        }

    }

    const validaErrosMedida = () => {
        const novosErros = {}

        if (!nomeCliente || nomeCliente === '') novosErros.nomeCliente = 'O nome não pode ser vazio!'

        if (!localMedida || localMedida === '') novosErros.localMedida = 'O local da medida é obrigatório'

        return novosErros
    }

    return (
        <>
            <View style={{
                flex: 1, backgroundColor: "#f2fa", paddingHorizontal: 24,
                paddingVertical: 24
            }}>

                <Caption>
                    Informações sobre as medidas
                </Caption>

                <TextInput
                    label=""
                    name="medida"
                    value={medidaX}
                    mode='outlined'
                    onChangeText={setMedidaX}
                    editable={data._id === null ? false : true} />

                <TextInput
                    label=""
                    name="medida"
                    value={medidaY}
                    mode='outlined'
                    onChangeText={setMedidaY}
                    editable={data._id === null ? false : true} />

                <TextInput
                    label="Nome do Cliente"
                    name="nome"
                    value={nomeCliente}
                    mode='outlined'
                    onChangeText={setNomeCliente} />

                <TextInput
                    label="Local da Medida"
                    name="local"
                    value={localMedida}
                    mode='outlined'
                    onChangeText={setLocalMedida}
                />
                <FAB
                    style={styles.FAB}
                    icon='content-save'
                    label='Salvar'
                    loading={salvandoMedicao}
                    disabled={erros.length > 0}
                    onPress={() => salvaMedicao()}
                />

                <Snackbar
                    visible={aviso.length > 0}
                    onDismiss={() => setAviso('')}
                    action={{
                        label: 'Voltar',
                        onPress: () => navigation.goBack()
                    }}>
                    <Text>{aviso}</Text>
                </Snackbar>

            </View>
        </>
    )
}


const styles = StyleSheet.create({
    input: {
        margin: 12,
        height: 40,
        borderWidth: 1

    }
    ,
    fab: {
        position: 'absolute',
        margin: 50,
        right: 0,
        bottom: 0
    }
})

export default withTheme(AdicionaMedicao)