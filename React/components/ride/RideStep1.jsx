import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView} from 'react-native';
import utilities from '../../styles/utilities';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import DatePicker from 'react-native-date-picker';

const RideStep1 = ({
                       error, rideName, setRideName, riderType, setRiderType,
                       participants, setParticipants, description, riderSearchQuery, setRiderSearchQuery,
                       searchedRiders, date, setDate, isRiderSearching, handleSearchRiders, setDescription, nextStep
                   }) => {


    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [dateError, setDateError] = useState('');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleDateConfirm = (selectedDate) => {
        if (selectedDate < today) {
            setDateError('Please select a future date');
            return;
        }
        setDateError('');
        setDate(selectedDate);
        setDatePickerOpen(false);
    };



    return (
            <View style={utilities.containerWhite}>
                <View style={[utilities.navbarContainerPrimary, { alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }]}>
                    <Text style={utilities.textWhite}>RIDE DETAILS</Text>

                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                        onPress={nextStep}
                    >
                        <Text style={utilities.buttonText}>Next</Text>
                        <FontAwesome name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                </View>
                {error ? <Text style={{color: 'red', marginBottom: 10}}>{error}</Text> : null}

                <View style={{ backgroundColor: "#151515", borderWidth: 2,  borderRadius: 12, margin: 10, padding: 10 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TextInput
                                style={[utilities.inputCenter, { flex: 1, marginRight: 10 }]}
                                value={rideName}
                                onChangeText={setRideName}
                                placeholder="Enter ride name"
                                placeholderTextColor="#fff"
                                color="#fff"
                            />
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 10,
                                        alignSelf: 'flex-start',
                                        borderWidth: dateError ? 2 : 1,
                                        borderColor: dateError ? 'red' : colors.primary,
                                        marginTop: -15,
                                    }}
                                    onPress={() => setDatePickerOpen(true)}
                                    activeOpacity={0.7}
                                >
                                    <FontAwesome name="calendar" size={24} color="#fff" />
                                </TouchableOpacity>

                            </View>
                        </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{
                            maxHeight: 75, // Reduced height
                        }}
                        contentContainerStyle={{
                            paddingVertical: 0 // Remove padding
                        }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity
                            style={[
                                utilities.riderTypeOption,
                                riderType === 'car' && utilities.selectedRiderType,
                                { borderTopRightRadius: 0, borderBottomRightRadius: 0, marginRight: 0 }
                            ]}
                            onPress={() => setRiderType('car')}
                        >
                            <FontAwesome name="car" size={24} color={riderType === 'car' ? '#fff' : '#333'} />
                            <Text style={{marginTop: 5, color: riderType === 'car' ? '#fff' : '#333'}}>Car</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                utilities.riderTypeOption,
                                riderType === 'motor' && utilities.selectedRiderType,
                                { borderRadius: 0, marginRight: 0 }
                            ]}
                            onPress={() => setRiderType('motor')}
                        >
                            <FontAwesome name="motorcycle" size={24} color={riderType === 'motor' ? '#fff' : '#333'} />
                            <Text style={{marginTop: 5, color: riderType === 'motor' ? '#fff' : '#333'}}>Motorcycle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                utilities.riderTypeOption,
                                riderType === 'bike' && utilities.selectedRiderType,
                                { borderRadius: 0, marginRight: 0 }
                            ]}
                            onPress={() => setRiderType('bike')}
                        >
                            <FontAwesome name="running" size={24} color={riderType === 'run' ? '#fff' : '#333'} />
                            <Text style={{marginTop: 5, color: riderType === 'run' ? '#fff' : '#333'}}>Run</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                utilities.riderTypeOption,
                                riderType === 'bike' && utilities.selectedRiderType,
                                { borderRadius: 0, marginRight: 0 }
                            ]}
                            onPress={() => setRiderType('bike')}
                        >
                            <FontAwesome name="bicycle" size={24} color={riderType === 'bike' ? '#fff' : '#333'} />
                            <Text style={{marginTop: 5, color: riderType === 'bike' ? '#fff' : '#333'}}>Bike</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                utilities.riderTypeOption,
                                riderType === 'cafe Racers' && utilities.selectedRiderType,
                                { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                            ]}
                            onPress={() => setRiderType('cafe Racers')}
                        >
                            <FontAwesome name="rocket" size={24} color={riderType === 'cafe Racers' ? '#fff' : '#333'} />
                            <Text style={{marginTop: 5, color: riderType === 'cafe Racers' ? '#fff' : '#333'}}>Cafe Racers</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>

                    <View style={{ padding: 10 }}>
                        {date && (
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                                <Text style={{ color: '#fff', fontSize: 14, marginRight: 8 }}>
                                    {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Text>
                                <Text style={{ color: '#fff', fontSize: 14 }}>
                                    {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true }).replace(':', ':')}
                                </Text>
                            </View>
                        )}
                        {dateError ? <Text style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{dateError}</Text> : null}
                        <DatePicker
                            modal
                            open={datePickerOpen}
                            date={date || new Date()}
                            minimumDate={today}
                            onConfirm={handleDateConfirm}
                            onCancel={() => setDatePickerOpen(false)}
                            mode="datetime"
                        />
                    </View>

                        <Text style={[utilities.textWhite, { textAlign: 'center' }]}>Riders</Text>
                    <View>
                        <TextInput
                            style={utilities.inputCenter}
                            value={riderSearchQuery}
                            onChangeText={(text) => {
                                setRiderSearchQuery(text);
                                handleSearchRiders(text);
                            }}
                            placeholder="Search for riders"
                            placeholderTextColor="#fff"
                            color="#fff"
                        />

                        {isRiderSearching && (
                            <ActivityIndicator size="small" color="#fff" style={{marginVertical: 10}} />
                        )}

                        {/* Search results */}
                        {searchedRiders.length > 0 && riderSearchQuery.trim() !== '' && (
                            <View style={utilities.searchResultsList}>
                                {searchedRiders.map((username, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={utilities.searchResultItem}
                                        onPress={() => {
                                            try {
                                                const participantsList = participants ? participants.split(',').map(p => p.trim()) : [];
                                                if (!participantsList.includes(username)) {
                                                    setParticipants(participants ?
                                                        `${participants}, ${username}` :
                                                        username);
                                                }
                                                setRiderSearchQuery('');
                                                handleSearchRiders(''); // Clear search results when a rider is selected
                                            } catch (error) {
                                                console.error('Error selecting participant:', error);
                                            }
                                        }}
                                    >
                                        <Text style={utilities.searchResultName}>{username}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Selected participants */}
                        {participants && (
                            <View style={{marginTop: 10, borderWidth: 1, borderColor: colors.white, borderRadius: 8, overflow: 'hidden'}}>
                                {/* Table Header */}
                                <View style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.primary,
                                    padding: 8,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#fff'
                                }}>
                                    <Text style={{color: '#fff', fontWeight: 'bold', flex: 1}}>Riders</Text>
                                </View>

                                {/* Table Body */}
                                <ScrollView style={{maxHeight: participants.split(',').length > 4 ? 150 : 'auto'}}>
                                    {participants.split(',').map((participant, index) => (
                                        participant.trim() && (
                                            <View key={index} style={{
                                                flexDirection: 'row',
                                                padding: 10,
                                                backgroundColor: index % 2 === 0 ? '#333' : '#222',
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#444',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{color: '#fff', flex: 1}}>{participant.trim()}</Text>
                                                <TouchableOpacity
                                                    style={{width: 50, alignItems: 'center'}}
                                                    onPress={() => {
                                                        const updated = participants.split(',')
                                                            .filter(p => p.trim() !== participant.trim())
                                                            .join(', ');
                                                        setParticipants(updated);
                                                    }}
                                                >
                                                    <FontAwesome name="times-circle" size={18} color={colors.white} />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    ))}
                                </ScrollView>

                                {/* Empty state */}
                                {(!participants || participants.trim() === '') && (
                                    <View style={{padding: 10, alignItems: 'center'}}>
                                        <Text style={{color: '#fff'}}>No participants added</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                        <View>

                                <Text style={[utilities.textWhite, { textAlign: 'center' }]}>Description</Text>
                                <TextInput
                                    style={[utilities.inputCenterDescription, {
                                        height: 300,
                                        textAlignVertical: 'top',
                                        fontSize: 16,
                                        paddingHorizontal: 15,
                                        paddingVertical: 12,
                                        width: '100%'
                                    }]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Enter ride description"
                                    multiline
                                    color="#fff"
                                />
                        </View>
                </View>
            </View>
    );
};

export default RideStep1;