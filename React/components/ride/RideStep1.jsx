import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView} from 'react-native';
import utilities from '../../styles/utilities';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import DatePicker from 'react-native-date-picker';
import InputUtilities from "../../styles/InputUtilities";

const RideStep1 = ({
                       error, rideName, setRideName, riderType, setRiderType,
                       participants, setParticipants, description, riderSearchQuery, setRiderSearchQuery,
                       searchedRiders, date, setDate, isRiderSearching, handleSearchRiders, setDescription, nextStep
                   }) => {

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [dateError, setDateError] = useState('');
    const [focusedInput, setFocusedInput] = useState(null);

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
        <View style={InputUtilities.containerWhite}>
            {/* Navigation Header */}
            <View style={InputUtilities.navbarContainerPrimary}>
                <Text style={InputUtilities.textWhite}>RIDE DETAILS</Text>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={nextStep}
                >
                    <Text style={InputUtilities.buttonText}>Next</Text>
                    <FontAwesome name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error ? (
                <View style={[InputUtilities.cardContainer, { backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1 }]}>
                    <Text style={InputUtilities.errorText}>{error}</Text>
                </View>
            ) : null}

            {/* Ride Name Section */}
            <View style={InputUtilities.cardContainer}>
                <Text style={InputUtilities.sectionTitle}>Name Your Ride</Text>
                <Text style={InputUtilities.label}>Give your adventure a memorable name</Text>
                <TextInput
                    style={[
                        InputUtilities.inputCenter,
                        focusedInput === 'rideName' && InputUtilities.inputCenterFocused
                    ]}
                    value={rideName}
                    onChangeText={setRideName}
                    onFocus={() => setFocusedInput('rideName')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Epic Bukidnon Adventure"
                    placeholderTextColor="#94a3b8"
                />
            </View>

            {/* Date and Ride Type Section */}
            <View style={InputUtilities.cardContainer}>
                <Text style={InputUtilities.sectionTitle}>When & How</Text>

                {/* Date Picker */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={InputUtilities.label}>Select Date & Time</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                            {date && (
                                <View style={InputUtilities.dateDisplay}>
                                    <Text style={InputUtilities.dateText}>
                                        {date.toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                    <Text style={InputUtilities.timeText}>
                                        {date.toLocaleTimeString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            style={[
                                InputUtilities.calendarButton,
                                dateError && InputUtilities.calendarButtonError
                            ]}
                            onPress={() => setDatePickerOpen(true)}
                            activeOpacity={0.7}
                        >
                            <FontAwesome name="calendar" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    {dateError ? <Text style={InputUtilities.errorText}>{dateError}</Text> : null}
                </View>

                {/* Ride Type Selection */}
                <View>
                    <Text style={InputUtilities.label}>Choose Ride Type</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 8 }}
                    >
                        <TouchableOpacity
                            style={[
                                InputUtilities.rideTypeOption,
                                riderType === 'car' && InputUtilities.selectedRiderType
                            ]}
                            onPress={() => setRiderType('car')}
                        >
                            <FontAwesome name="car" size={24} color={riderType === 'car' ? '#fff' : '#64748b'} />
                            <Text style={{
                                marginTop: 8,
                                color: riderType === 'car' ? '#fff' : '#64748b',
                                fontSize: 12,
                                fontWeight: '500'
                            }}>Car</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                InputUtilities.rideTypeOption,
                                riderType === 'motor' && InputUtilities.selectedRiderType
                            ]}
                            onPress={() => setRiderType('motor')}
                        >
                            <FontAwesome name="motorcycle" size={24} color={riderType === 'motor' ? '#fff' : '#64748b'} />
                            <Text style={{
                                marginTop: 8,
                                color: riderType === 'motor' ? '#fff' : '#64748b',
                                fontSize: 12,
                                fontWeight: '500'
                            }}>Motorcycle</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                InputUtilities.rideTypeOption,
                                riderType === 'run' && InputUtilities.selectedRiderType
                            ]}
                            onPress={() => setRiderType('run')}
                        >
                            <FontAwesome name="shoe-prints" size={24} color={riderType === 'run' ? '#fff' : '#64748b'} />
                            <Text style={{
                                marginTop: 8,
                                color: riderType === 'run' ? '#fff' : '#64748b',
                                fontSize: 12,
                                fontWeight: '500'
                            }}>Run</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                InputUtilities.rideTypeOption,
                                riderType === 'bike' && InputUtilities.selectedRiderType
                            ]}
                            onPress={() => setRiderType('bike')}
                        >
                            <FontAwesome name="bicycle" size={24} color={riderType === 'bike' ? '#fff' : '#64748b'} />
                            <Text style={{
                                marginTop: 8,
                                color: riderType === 'bike' ? '#fff' : '#64748b',
                                fontSize: 12,
                                fontWeight: '500'
                            }}>Bike</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                InputUtilities.rideTypeOption,
                                riderType === 'cafe Racers' && InputUtilities.selectedRiderType
                            ]}
                            onPress={() => setRiderType('cafe Racers')}
                        >
                            <FontAwesome name="rocket" size={24} color={riderType === 'cafe Racers' ? '#fff' : '#64748b'} />
                            <Text style={{
                                marginTop: 8,
                                color: riderType === 'cafe Racers' ? '#fff' : '#64748b',
                                fontSize: 12,
                                fontWeight: '500'
                            }}>Cafe Racers</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>

            {/* Riders Section */}
            <View style={InputUtilities.cardContainer}>
                <Text style={InputUtilities.sectionTitle}>Who's Joining?</Text>
                <Text style={InputUtilities.label}>Search and add riders to your adventure</Text>

                <TextInput
                    style={[
                        InputUtilities.inputCenter,
                        focusedInput === 'riders' && InputUtilities.inputCenterFocused
                    ]}
                    value={riderSearchQuery}
                    onChangeText={(text) => {
                        setRiderSearchQuery(text);
                        handleSearchRiders(text);
                    }}
                    onFocus={() => setFocusedInput('riders')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Search for riders..."
                    placeholderTextColor="#94a3b8"
                />

                {isRiderSearching && (
                    <ActivityIndicator size="small" color="#8c2323" style={{marginVertical: 16}} />
                )}

                {/* Search Results */}
                {searchedRiders.length > 0 && riderSearchQuery.trim() !== '' && (
                    <View style={InputUtilities.searchResultsList}>
                        <ScrollView style={{ maxHeight: 200 }}>
                            {searchedRiders.map((username, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={InputUtilities.searchResultItem}
                                    onPress={() => {
                                        try {
                                            const participantsList = participants ? participants.split(',').map(p => p.trim()) : [];
                                            if (!participantsList.includes(username)) {
                                                setParticipants(participants ?
                                                    `${participants}, ${username}` :
                                                    username);
                                            }
                                            setRiderSearchQuery('');
                                            handleSearchRiders('');
                                        } catch (error) {
                                            console.error('Error selecting participant:', error);
                                        }
                                    }}
                                >
                                    <Text style={InputUtilities.searchResultName}>{username}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Selected Participants */}
                {participants && (
                    <View style={InputUtilities.participantsTable}>
                        <View style={InputUtilities.tableHeader}>
                            <Text style={InputUtilities.tableHeaderText}>Selected Riders</Text>
                        </View>
                        <ScrollView style={{maxHeight: participants.split(',').length > 4 ? 200 : 'auto'}}>
                            {participants.split(',').map((participant, index) => (
                                participant.trim() && (
                                    <View key={index} style={[
                                        InputUtilities.tableRow,
                                        index % 2 === 0 ? InputUtilities.tableRowEven : InputUtilities.tableRowOdd
                                    ]}>
                                        <Text style={InputUtilities.participantName}>{participant.trim()}</Text>
                                        <TouchableOpacity
                                            style={{ padding: 8 }}
                                            onPress={() => {
                                                const updated = participants.split(',')
                                                    .filter(p => p.trim() !== participant.trim())
                                                    .join(', ');
                                                setParticipants(updated);
                                            }}
                                        >
                                            <FontAwesome name="times-circle" size={20} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            ))}
                        </ScrollView>
                        {(!participants || participants.trim() === '') && (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Text style={InputUtilities.label}>No riders added yet</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Description Section */}
            <View style={InputUtilities.cardContainer}>
                <Text style={InputUtilities.sectionTitle}>Describe Your Route</Text>
                <Text style={InputUtilities.label}>Share details about terrain, highlights, or special stops</Text>
                <TextInput
                    style={[
                        InputUtilities.inputCenterDescription,
                        focusedInput === 'description' && InputUtilities.inputCenterFocused,
                        { textAlignVertical: 'top' }
                    ]}
                    value={description}
                    onChangeText={setDescription}
                    onFocus={() => setFocusedInput('description')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Tell us about the terrain, highlights, or any special stops along the way..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={6}
                />
            </View>

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
    );
};

export default RideStep1;