import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
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

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={utilities.containerWhite}>
            <View style={[utilities.navbarContainerPrimary, { alignItems: 'center', justifyContent: 'center' }]}>

            <Text style={utilities.textWhite}>RIDE DETAILS</Text>
            </View>
            {error ? <Text style={{color: 'red', marginBottom: 10}}>{error}</Text> : null}

            <TextInput
                style={utilities.inputCenter}
                value={rideName}
                onChangeText={setRideName}
                placeholder="Enter ride name"
                placeholderTextColor="#fff"
                color="#fff"
            />

            <View style={{flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center'}}>
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


            <View>
                <Text style={[utilities.textWhite, { fontSize: 14, marginBottom: 4 }]}>DATE</Text>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.primary,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        minWidth: 120,
                        alignSelf: 'flex-start',
                        borderWidth: dateError ? 1 : 0,
                        borderColor: dateError ? 'red' : 'transparent'
                    }}
                    onPress={() => setDatePickerOpen(true)}
                    activeOpacity={0.7}
                >
                    <FontAwesome name="calendar" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={{ color: dateError ? 'red' : '#fff', fontSize: 20 }}>
                        {formatDate(date) || "Select date"}
                    </Text>
                </TouchableOpacity>
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

            <Text style={utilities.label}>Participants</Text>
            <View>
                <TextInput
                    style={utilities.input}
                    value={riderSearchQuery}
                    onChangeText={(text) => {
                        setRiderSearchQuery(text);
                        handleSearchRiders(text);
                    }}
                    placeholder="Search for riders"
                />

                {isRiderSearching && (
                    <ActivityIndicator size="small" color={colors.primary} style={{marginVertical: 10}} />
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
                    <View style={{marginTop: 10}}>
                        <Text style={utilities.label}>Selected Participants:</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
                            {participants.split(',').map((participant, index) => (
                                participant.trim() && (
                                    <View key={index} style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 15,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        margin: 3,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: '#fff', marginRight: 5}}>{participant.trim()}</Text>
                                        <TouchableOpacity onPress={() => {
                                            const updated = participants.split(',')
                                                .filter(p => p.trim() !== participant.trim())
                                                .join(', ');
                                            setParticipants(updated);
                                        }}>
                                            <FontAwesome name="times-circle" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            ))}
                        </View>
                    </View>
                )}
            </View>

            <Text style={utilities.label}>Description</Text>
            <TextInput
                style={[utilities.input, {
                    height: 200,
                    textAlignVertical: 'top',
                    fontSize: 16,
                    paddingHorizontal: 15,
                    paddingVertical: 12
                }]}                value={description}
                onChangeText={setDescription}
                placeholder="Enter ride description"
                multiline
            />


            <View style={[utilities.bottomAreaContainerLeft, {
            }]}>
                <TouchableOpacity
                    style={utilities.button}
                    onPress={nextStep}
                    disabled={!rideName.trim()}
                >
                    <Text style={utilities.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep1;