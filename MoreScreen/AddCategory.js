import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {addCategory} from '../api/api';
import {useAuth} from '../api/authContext';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  inputBg: '#F8FAFC',
};

const AddCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userToken} = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('cart-shopping');
  const [loading, setLoading] = useState(false);

  const selectedIcon = route.params?.selectedIcon;

  useEffect(() => {
    if (selectedIcon) {
      setCategoryIcon(selectedIcon);
    }
  }, [selectedIcon]);

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Missing Name', 'Please enter a category name.');
      return;
    }

    try {
      setLoading(true);

      await addCategory(
        {
          category_name: categoryName.trim(),
          category_icon: categoryIcon,
        },
        userToken,
      );

      setCategoryName('');
      navigation.navigate('ViewCategory');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={20} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Add Category</Text>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSaveCategory}>
              <AntDesign name="check" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <AntDesign name="appstore1" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Create a new category</Text>
              <Text style={styles.heroSubtitle}>
                Add a name and choose an icon to keep your transactions neatly
                organized.
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.iconPicker}
              onPress={() =>
                navigation.navigate('CategoryIcon', {
                  selectedIcon: categoryIcon,
                })
              }>
              <View style={styles.iconCircle}>
                <FontAwesome6
                  name={categoryIcon}
                  size={42}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.iconEditBadge}>
                <AntDesign name="edit" size={14} color="#FFFFFF" />
              </View>

              <Text style={styles.iconPickerTitle}>Choose Icon</Text>
              <Text style={styles.iconPickerSubtitle}>
                Tap to select a category icon
              </Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category name"
                placeholderTextColor="#94A3B8"
                onChangeText={setCategoryName}
                value={categoryName}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                (!categoryName.trim() || loading) && styles.addButtonDisabled,
              ]}
              onPress={handleSaveCategory}
              disabled={!categoryName.trim() || loading}>
              <Text style={styles.addButtonText}>
                {loading ? 'Saving...' : 'Add Category'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconPicker: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEditBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 78,
    right: 110,
    borderWidth: 3,
    borderColor: COLORS.card,
  },
  iconPickerTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  iconPickerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.subText,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default AddCategory;
