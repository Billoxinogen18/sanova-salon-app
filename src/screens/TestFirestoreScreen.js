import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { db } from '../../firebaseconfig';
import { doc, setDoc, getDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

export default function TestFirestoreScreen() {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (message, success = true) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      message,
      success,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testFirestoreConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addTestResult('🔥 Starting Firestore connection test...');
      
      // Test 1: Write a document
      addTestResult('📝 Testing document write...');
      const testDoc = doc(db, 'test', 'connection-test');
      await setDoc(testDoc, {
        message: 'Hello from React Native!',
        timestamp: new Date(),
        test: 'connection_test'
      });
      addTestResult('✅ Document write successful!');
      
      // Test 2: Read the document
      addTestResult('📖 Testing document read...');
      const docSnap = await getDoc(testDoc);
      if (docSnap.exists()) {
        addTestResult('✅ Document read successful!');
        addTestResult(`📄 Document data: ${JSON.stringify(docSnap.data())}`);
      } else {
        addTestResult('❌ Document not found after write', false);
      }
      
      // Test 3: Add to collection
      addTestResult('📝 Testing collection add...');
      const collectionRef = collection(db, 'test-collection');
      const docRef = await addDoc(collectionRef, {
        message: 'Test collection document',
        timestamp: new Date()
      });
      addTestResult(`✅ Collection add successful! Document ID: ${docRef.id}`);
      
      // Test 4: Clean up
      addTestResult('🧹 Cleaning up test documents...');
      await deleteDoc(testDoc);
      await deleteDoc(docRef);
      addTestResult('✅ Cleanup successful!');
      
      addTestResult('🎉 All Firestore tests passed!', true);
      
    } catch (error) {
      addTestResult(`❌ Firestore test failed: ${error.message}`, false);
      addTestResult(`Error code: ${error.code}`, false);
      console.error('Firestore test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firestore Connection Test</Text>
      
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={testFirestoreConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Firestore Connection'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={clearResults}
      >
        <Text style={styles.buttonText}>Clear Results</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.resultsContainer}>
        {testResults.map((result) => (
          <View key={result.id} style={styles.resultItem}>
            <Text style={[
              styles.resultText,
              result.success ? styles.successText : styles.errorText
            ]}>
              [{result.timestamp}] {result.message}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    marginTop: 20,
  },
  resultItem: {
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  successText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
});
