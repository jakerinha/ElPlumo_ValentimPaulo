import React from 'react'
import {View, Text, StyleSheet, Image, Alert, TouchableOpacity, Touchable} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import {BACKEND} from '../constants'

import {List, withTheme, Avatar} from 'react-native-paper'

function Medicao({data, navigation}){
    
    function buttonRight(){
        return(
            <View>
                <TouchableOpacity style={styles.buttonDelete} onPress={confirmExclusion}>
                    <Avatar.Icon size={24} icon="delete" style={{backgroundColor: "#111fdd"}}/>
                    <Text>Excluir</Text>
                </TouchableOpacity>
            </View>
        )
    }

    async function confirmExclusion(){
        setExcluindo(true)
        try{
            Alert.alert('Atenção!', 'Deseja mesmo excluir esta categoria?', [
                {text: "Não", style:"cancel"},
                {
                    text: 'Sim',
                    onPress: async () => {
                        await excluirMedicao(data)
                    },
                }
            ])
        }catch (response){
            Alert.alert(response.data.error)
        }
        setExcluindo(false)
    }

    async function excluirMedicao(data){
        let url = `${BACKEND}/medicoes/${data._id}`
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type':'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                Alert.alert('Aviso', data.message)
                navigation.goBack()
            })
            .catch(function (error) {
                console.error('Houve um problema ao excluir a categoria: ' + error.message);
            })
    }

    const alteraMedicao = async (data) => {
        navigation.navigate('AdicionaMedicao', {
            data: data
        })
    }

    return(
        <>
        <Swipeable renderRightActions={buttonRight}>
            <TouchableOpacity style={styles.Container}
                               onPress={()=> alteraMedicao(data)}>
                <View style={{flex:1, justifyContent:'center', backgroundColor: "#11ccdf", borderRadius: 20}}>
                    <List.Item
                        title={data.nomeCliente}
                        description={`Data: ${data.dataMedicao}`}
                        />
                </View>
            </TouchableOpacity>
        </Swipeable>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        height: 100,
        borderRadius: 8,
        marginBottom: 2,
        marginHorizontal: 8
    },
    buttonDelete:{
        backgroundColor: "#d9534f",
        height: 100,
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20
    }
})

export default withTheme(Medicao)