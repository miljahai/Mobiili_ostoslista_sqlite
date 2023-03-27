import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Header, Icon, Button, Input, ListItem } from '@rneui/themed';


export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [ostokset, setOstokset] = useState([]);

  const db = SQLite.openDatabase('ostosdb.db');
 

  useEffect (() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists ostos (id integer primary key not null, product text, amount text); ');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into ostos (product, amount) values (?, ?);', 
      [product, amount]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from ostos;', [], (_, {rows}) => 
      setOstokset(rows._array)
      );
    }, null, null);
    setProduct('');
    setAmount('');
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => tx.executeSql('delete from ostos where id = ?;', [id]), 
      null, updateList) 
  }
  return (
    <View style={styles.container}>
      
     <Header 
     centerComponent={{text: 'Ostoslista', style: {color: '#fff', fontSize: 20}, }}/> 

    <Input
      style= {{marginTop: 50, fontSize: 18}}
      placeholder='Tuote'
      label='TUOTE'
      value={product}
      onChangeText={product => setProduct(product)} />
    
    <Input
      style={styles.input}
      placeholder='Määrä'
      label='MÄÄRÄ'
      value={amount}
      onChangeText={amount => setAmount(amount)} />

     <Button type="solid" onPress={saveItem} >Tallenna<Icon name='save' color='white'/></Button>

    <FlatList
      style={{marginLeft: "5%"}}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => 
      <View style={styles.listcontainer}>       
        <Text>{item.product}, {item.amount}</Text> 
        <Button color='white' onPress={() => deleteItem(item.id)}><Icon name='delete' color= 'red' /> </Button>
      </View>}
      data={ostokset}
  />
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18
  },
  button: {
    marginBottom: 20,
    },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    margin:10

  }
});


/* */