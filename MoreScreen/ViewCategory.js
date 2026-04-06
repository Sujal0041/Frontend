import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {getAllCategories} from '../api/api';
import {useAuth} from '../api/authContext';

const COLORS = {
  bg: '#F4F7FB',
  card: '#FFFFFF',
  text: '#0F172A',
  subText: '#64748B',
  border: '#E2E8F0',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  success: '#16A34A',
};

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const {userToken} = useAuth();
  const navigation = useNavigation();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(userToken);
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
    }, []),
  );

  const renderItem = ({item}) => (
    <View
      activeOpacity={0.88}
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CategoryDetail', {category: item})}>
      <View style={styles.cardTopRow}>
        <View style={styles.iconWrap}>
          <FontAwesome6
            name={item.category_icon || 'layer-group'}
            size={18}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.cardTextWrap}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {item.category_name}
          </Text>
          <Text style={styles.categorySubtitle}>Category</Text>
        </View>

        <View style={styles.arrowWrap}>
          <AntDesign name="right" size={16} color={COLORS.subText} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Categories</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('AddCategory')}>
          <AntDesign name="plus" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <AntDesign name="appstore1" size={22} color={COLORS.primary} />
            </View>

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Manage your categories</Text>
              <Text style={styles.heroSubtitle}>
                Organize your transactions better by viewing and managing all
                your categories in one place.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <AntDesign name="inbox" size={28} color={COLORS.subText} />
            <Text style={styles.emptyTitle}>No categories yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first category to keep your expenses and income
              organized.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddCategory')}>
              <Text style={styles.emptyButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: COLORS.bg,
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 100,
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
  categoryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  categorySubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.subText,
  },
  arrowWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 34,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.subText,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default ViewCategory;
