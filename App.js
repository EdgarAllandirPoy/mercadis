import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const App = () => {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantidade, setNewItemQuantidade] = useState('');
  const [newItemPrecoUnitario, setNewItemPrecoUnitario] = useState('');

  const addItem = () => {
    if (text.trim() !== '') {
      const newItem = {
        id: Date.now(),
        name: text.trim(),
        quantidade: 1,
        precoUnitario: 0,
      };
      setItems([...items, newItem]);
      setText('');
    }
  };

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const startEditingItem = (itemId) => {
    setEditingItem(itemId);
    const item = items.find(item => item.id === itemId);
    setNewItemName(item.name);
    setNewItemQuantidade(item.quantidade.toString());
    setNewItemPrecoUnitario(item.precoUnitario.toString());
  };

  const saveEditedItem = () => {
    const updatedItems = items.map(item => {
      if (item.id === editingItem) {
        return { ...item, name: newItemName, quantidade: parseInt(newItemQuantidade), precoUnitario: parseFloat(newItemPrecoUnitario) };
      }
      return item;
    });
    setItems(updatedItems);
    setEditingItem(null);
  };

  const calculateItemPrice = (item) => {
    return item.quantidade * item.precoUnitario;
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + calculateItemPrice(item), 0);
  };

  const calculateTotalItems = () => {
    return items.reduce((total, item) => total + item.quantidade, 0);
  };

  const resetList = () => {
    setItems([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {editingItem === item.id ? (
        <View style={styles.editingItem}>
          <TextInput
            style={styles.editingInput}
            value={newItemName}
            onChangeText={setNewItemName}
            placeholder="Nome do item"
          />
          <TextInput
            style={styles.editingInput}
            value={newItemQuantidade}
            onChangeText={setNewItemQuantidade}
            keyboardType="numeric"
            placeholder="Quantidade"
          />
          <TextInput
            style={styles.editingInput}
            value={newItemPrecoUnitario}
            onChangeText={setNewItemPrecoUnitario}
            keyboardType="numeric"
            placeholder="Preço unitário"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveEditedItem}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantidade}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.itemPrice}>R${calculateItemPrice(item).toFixed(2)}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => startEditingItem(item.id)}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const updateQuantity = (itemId, value) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId && item.quantidade + value >= 0) {
        return { ...item, quantidade: item.quantidade + value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Supermercado Shibata</Text>
        <Image
          style={styles.logo}
          source={require('./imagens/logo.png')} // Ajuste o caminho da imagem
        />
      </View>
      <StatusBar style="auto" />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um item"
          value={text}
          onChangeText={(value) => setText(value)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total de itens: {calculateTotalItems()}</Text>
        <Text style={styles.summaryText}>Preço total: R${calculateTotalPrice().toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetList}>
        <Text style={styles.resetButtonText}>Resetar Lista</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1a3353',
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#1a3353',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemContainer: {
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#1a3353',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#f9c74f',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f94144',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
  editingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  editingInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#1a3353',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#f94144',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
