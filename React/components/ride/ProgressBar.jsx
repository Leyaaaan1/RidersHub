import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import utilities from '../../styles/utilities';
import colors from '../../styles/colors';

const ProgressBar = ({
                         showProgressBar,
                         setShowProgressBar,
                         startingPoint,
                         endingPoint,
                         stopPoints,
                         isAddingStop,
                         currentStop
                     }) => (
    <View style={utilities.progressIndicatorVertical}>
        <TouchableOpacity
            style={{ alignItems: 'center', marginBottom: 8 }}
            onPress={() => setShowProgressBar?.(prev => !prev)}
            activeOpacity={0.7}
        >
            <FontAwesome
                name={showProgressBar ? 'chevron-up' : 'chevron-down'}
                size={12}
                color={colors.primary}
            />
            <Text style={{ color: colors.primary, marginTop: 2 }}>
                {showProgressBar ? 'Hide Route' : 'Show Route'}
            </Text>
        </TouchableOpacity>
        {showProgressBar && (
            <ScrollView
                style={{ maxHeight: 280 }}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
            >
                {/* Start */}
                <View style={[utilities.progressStepSmall, {
                    backgroundColor: startingPoint ? '#2e7d32' : colors.primary }]}>
                    <Text style={utilities.progressTextSmall}>Start</Text>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>{startingPoint || 'Not set'}</Text>
                </View>
                <FontAwesome name="arrow-down" size={18} color={startingPoint ? '#2e7d32' : colors.primary} style={{ alignSelf: 'center', marginBottom: 4 }} />

                {/* Stops */}
                {stopPoints.map((sp, idx) => (
                    <React.Fragment key={idx}>
                        <View style={[utilities.progressStepSmall, { backgroundColor: '#1565c0' }]}>
                            <Text style={utilities.progressTextSmall}>Stop {idx + 1}</Text>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>{sp.name || `${sp.lat}, ${sp.lng}`}</Text>
                        </View>
                        <FontAwesome name="arrow-down" size={18} color="#2e7d32" style={{ alignSelf: 'center', marginVertical: 2 }} />
                    </React.Fragment>
                ))}

                {/* Adding Stop */}
                {isAddingStop && (
                    <>
                        <View style={[utilities.progressStepSmall, { backgroundColor: '#f9a825' }]}>
                            <Text style={utilities.progressTextSmall}>Adding...</Text>
                            {currentStop && <Text style={{ fontSize: 10, color: '#fff' }}>{currentStop.name || `${currentStop.lat}, ${currentStop.lng}`}</Text>}
                        </View>
                        {currentStop && <Text style={{ fontSize: 10, color: '#fff' }}>{currentStop.name || `${currentStop.lat}, ${currentStop.lng}`}</Text>}
                    </>
                )}

                {/* End */}
                <View style={[utilities.progressStepSmall, { backgroundColor: endingPoint ? '#2e7d32' : colors.primary }]}>
                    <Text style={utilities.progressTextSmall}>End</Text>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>{endingPoint || 'Not set'}</Text>
                </View>
            </ScrollView>
        )}
    </View>
);

export default ProgressBar;