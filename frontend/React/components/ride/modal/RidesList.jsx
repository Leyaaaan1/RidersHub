import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {fetchMyRides} from '../../../services/rideService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../../styles/tokens/colors';
import RideCard from './RideCard';
import {useFocusEffect} from '@react-navigation/native';
import {RideContext} from '../../../context/RideContext';

const AUTO_RETRY_DELAY_MS = 8000; // wait 8s then auto-retry on timeout

const RidesList = forwardRef(
  (
    {
      onRideSelect,
      mode = 'all',
      pageSize = 10,
      ListHeaderComponent,
      style,
      contentContainerStyle = {padding: 15},
      userId,
      onExtraRefresh,
    },
    ref,
  ) => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isTimeout, setIsTimeout] = useState(false);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const retryTimerRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    // Mirrors `hasMore` without being a loadRides dependency, so loadRides
    // keeps a stable identity across pagination — see note below.
    const hasMoreRef = useRef(true);
    useEffect(() => {
      hasMoreRef.current = hasMore;
    }, [hasMore]);

    const deletedRideIdsRef = useRef(new Set());
    const {deletedRideIds, newlyCreatedRides} = useContext(RideContext);
    const newlyCreatedRidesRef = useRef([]);
    // Drop a deleted ride the instant RideStep4 reports it — don't wait on

    useEffect(() => {
      newlyCreatedRidesRef.current = newlyCreatedRides || [];
      setRides(prev => {
        const existingIds = new Set(prev.map(r => String(r?.generatedRidesId)));
        const toAdd = newlyCreatedRidesRef.current.filter(
          r => !existingIds.has(String(r?.generatedRidesId)),
        );
        return toAdd.length ? [...toAdd, ...prev] : prev;
      });
    }, [newlyCreatedRides]);

    // navigation focus to fire (see notifyRideDeleted in RideContext).
    useEffect(() => {
      deletedRideIdsRef.current = deletedRideIds || new Set();
      setRides(prev =>
        prev.filter(
          r => !deletedRideIdsRef.current.has(String(r?.generatedRidesId)),
        ),
      );
    }, [deletedRideIds]);
    const isMyRidesMode = mode === 'my';

    const clearRetryTimers = () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };

    const loadRides = useCallback(
      async (pageNum, refresh = false) => {
        if (!refresh && !hasMoreRef.current) return;
        clearRetryTimers();
        try {
          refresh ? setRefreshing(true) : setLoading(true);
          setError('');
          setIsTimeout(false);

          const result = await fetchMyRides(pageNum, pageSize, refresh);

          if (result?.content) {
            const filtered = result.content.filter(
              r => !deletedRideIdsRef.current.has(String(r?.generatedRidesId)),
            );
            setRides(prev => {
              const fetched = refresh ? filtered : [...prev, ...filtered];
              const fetchedIds = new Set(
                fetched.map(r => String(r?.generatedRidesId)),
              );
              const stillPending = newlyCreatedRidesRef.current.filter(
                r => !fetchedIds.has(String(r?.generatedRidesId)),
              );
              return [...stillPending, ...fetched];
            });
            setHasMore(!result.last);
            setPage(result.number);
          }
        } catch (err) {
          const timedOut = err.message === 'REQUEST_TIMEOUT';
          setIsTimeout(timedOut);
          setError(
            timedOut
              ? 'REQUEST_TIMEOUT'
              : err.message || 'Failed to load rides',
          );

          if (timedOut) {
            // Start countdown and auto-retry
            let seconds = Math.round(AUTO_RETRY_DELAY_MS / 1000);
            setRetryCountdown(seconds);
            countdownIntervalRef.current = setInterval(() => {
              seconds -= 1;
              setRetryCountdown(seconds);
              if (seconds <= 0) {
                clearInterval(countdownIntervalRef.current);
              }
            }, 1000);
            retryTimerRef.current = setTimeout(() => {
              loadRides(0, true);
            }, AUTO_RETRY_DELAY_MS);
          }
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      // Deliberately NOT depending on `hasMore`/`mode`/`isMyRidesMode` — none
      // of them are read in the body above (mode isn't even passed to
      // fetchMyRides). Keeping this stable means useFocusEffect below only
      // re-fires on a genuine focus event or a real userId change, not on
      // every page load.
      [pageSize],
    );

    // Clean up timers on unmount
    useEffect(() => () => clearRetryTimers(), []);

    useEffect(() => {
      setRides([]);
      setError('');
      setIsTimeout(false);
      setHasMore(true);
      setPage(0);
    }, [mode]);

    useEffect(() => {
      // Always reset state when userId changes (including logout → null)
      setRides([]);
      setError('');
      setIsTimeout(false);
      setHasMore(true);
      setPage(0);
      clearRetryTimers();

      // Initial load happens here — on mount and on a real userId change only.
      // Simply revisiting this screen no longer triggers a refetch.
      // Use pull-to-refresh for that.
      if (userId) {
        loadRides(0);
      }
    }, [userId, loadRides]);

    const handleRefresh = useCallback(async () => {
      await loadRides(0, true);
      onExtraRefresh?.();
    }, [loadRides, onExtraRefresh]);

    // Exposes imperative methods on the forwarded ref so parent screens
    // (e.g. RiderPage) can trigger a refresh or reset without owning any
    // of this list's internal state. `refresh` mirrors pull-to-refresh;
    // `reset` clears everything back to its pre-fetch shape.
    useImperativeHandle(
      ref,
      () => ({
        refresh: handleRefresh,
        reset: () => {
          clearRetryTimers();
          setRides([]);
          setError('');
          setIsTimeout(false);
          setHasMore(true);
          setPage(0);
        },
      }),
      [handleRefresh],
    );

    const handleLoadMore = useCallback(() => {
      if (!loading && hasMore) loadRides(page + 1);
    }, [loading, hasMore, page, loadRides]);

    const renderItem = useCallback(
      ({item}) => (
        <RideCard
          item={item}
          onPress={onRideSelect}
          variant="full"
          showCreator={!isMyRidesMode}
        />
      ),
      [onRideSelect, isMyRidesMode],
    );

    const renderFooter = () => {
      if (!loading || refreshing) return null;
      return (
        <View style={{padding: 20, alignItems: 'center'}}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    };

    // Handles empty list, no-rides, AND error/timeout states — all rendered
    // as ListEmptyComponent so the header above the list never disappears,
    // even when this fetch fails.
    const renderEmpty = () => {
      if (error) {
        if (isTimeout) {
          return (
            <View style={{padding: 20, alignItems: 'center'}}>
              <FontAwesome
                name="hourglass-half"
                size={36}
                color="#f59e0b"
                style={{marginBottom: 12}}
              />
              <Text
                style={{
                  color: '#f59e0b',
                  fontSize: 16,
                  fontWeight: '700',
                  marginBottom: 6,
                }}>
                Server is waking up…
              </Text>
              <Text
                style={{
                  color: '#aaa',
                  textAlign: 'center',
                  fontSize: 13,
                  marginBottom: 16,
                  lineHeight: 20,
                }}>
                We're on free-tier servers — they go to sleep between requests.
                {'\n'}
                Retrying automatically in {retryCountdown}s.
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 28,
                  borderRadius: 8,
                }}
                onPress={() => {
                  clearRetryTimers();
                  handleRefresh();
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>
                  Retry Now
                </Text>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <View style={{padding: 20, alignItems: 'center'}}>
            <FontAwesome
              name="exclamation-triangle"
              size={32}
              color="red"
              style={{marginBottom: 15}}
            />
            <Text style={{color: 'red', textAlign: 'center', marginBottom: 15}}>
              {error}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
              }}
              onPress={handleRefresh}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Retry</Text>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View style={{padding: 40, alignItems: 'center'}}>
          <FontAwesome
            name="road"
            size={48}
            color="#666"
            style={{marginBottom: 15}}
          />
          <Text style={{color: '#ddd', fontSize: 16}}>
            {isMyRidesMode
              ? "You haven't created any rides yet"
              : 'No rides available'}
          </Text>
        </View>
      );
    };

    return (
      <FlatList
        style={style}
        data={error ? [] : rides}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.generatedRidesId?.toString() || index.toString()
        }
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={loading && !refreshing ? null : renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={10}
        initialNumToRender={6}
      />
    );
  },
);

RidesList.displayName = 'RidesList';

export default RidesList;