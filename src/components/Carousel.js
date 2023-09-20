import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {height, width} from '../globalStyles';
import {useDispatch} from 'react-redux';
import {setTabBar} from '../slice/tabBarSlice';

export default function Carousel({pages, pageWidth, gap, offset, navigation}) {
  const [page, setPage] = useState(0);

  const flatListRef = useRef();
  const dispatch = useDispatch();

  const navigateDetail = () => {
    const tabMove = () => {
      dispatch(setTabBar({tabBar: true}));
      const move = setTimeout(() => {
        navigation.navigate('Detail');
      }, 100);
      return () => clearTimeout(move);
    };
    tabMove();
  };

  function renderItem({item}) {
    const navigateSearch = () => {
      dispatch(
        setTabBar({
          tabBar: true,
        }),
      );
      const tabMove = () => {
        const move = setTimeout(() => {
          navigation.navigate('Search');
        }, 300);
        return () => clearTimeout(move);
      };
      tabMove();
    };
    return (
      <TouchableWithoutFeedback
        onPress={item.test ? navigateDetail : navigateSearch}>
        <View
          item={item}
          style={[
            styles.card,
            {
              width: pageWidth,
              marginHorizontal: gap / 2,
              padding: width * 20,
            },
          ]}>
          <View style={styles.item_con}>
            <View style={styles.item_con}>
              <Image
                source={item.src}
                style={{width: width * 50, height: height * 50}}
              />
              <Text style={styles.item_font}>{item.category}</Text>
            </View>

            <TouchableOpacity onPress={navigateSearch}>
              <Image
                source={require('../assets/images/addBtn.png')}
                style={{width: width * 50, height: height * 50}}
              />
            </TouchableOpacity>
          </View>
          {item.test ? (
            <View style={styles.text_con}>
              <Text style={styles.text}>데이터 있다는 가정</Text>
            </View>
          ) : (
            <View style={styles.text_con}>
              <Text style={styles.text}>오늘 먹은 식단을 설정해보세요</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const onScroll = e => {
    const newPage = Math.round(
      e.nativeEvent.contentOffset.x / (pageWidth + gap),
    );

    if (e.nativeEvent.contentOffset.x === 0) {
      flatListRef.current.scrollToOffset({
        offset: 1,
        animated: false,
      });
    }
    setPage(newPage);
  };

  return (
    <>
      <View style={styles.carousel_con}>
        <FlatList
          ref={flatListRef}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={{
            paddingHorizontal: offset + gap / 2,
          }}
          data={pages}
          decelerationRate="fast"
          horizontal
          keyExtractor={item => item.num}
          onScroll={onScroll}
          pagingEnabled={false}
          renderItem={renderItem}
          snapToInterval={pageWidth + gap}
          // snapToAlignment="start"
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  carousel_con: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

    marginBottom: 20,
  },
  card: {
    width: width * 250,
    height: height * 350,
    // marginRight: width * 20,
    marginTop: height * 20,
    // marginBottom: height * 40,
    marginBottom: height * 20,
    borderRadius: 30,
    backgroundColor: '#fff',
    shadowColor: 'black', // 쉐도우 색상
    shadowOffset: {width: 0, height: 0}, // 쉐도우 위치 조절 (가로, 세로)
    shadowOpacity: 0.2, // 쉐도우 투명도
    shadowRadius: 4, // 쉐도우 반경 (퍼지는 정도)
    elevation: 6, // 안드로이드의 경우 쉐도우 효과를 지정하기 위해 elevation 사용
  },
  item_con: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item_font: {
    marginLeft: width * 5,
    fontSize: width * 18,
  },
  text_con: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: width * 16,
  },
});
