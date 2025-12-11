import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView} from 'react-native';
import utilities from '../../styles/utilities';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
import DatePicker from 'react-native-date-picker';
import InputUtilities from "../../styles/InputUtilities";

const RideStep1 = ({
                       error, rideName, setRideName, riderType, setRiderType,
                       participants, setParticipants, description, date, setDate, isRiderSearching, handleSearchRiders, setDescription, nextStep,
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
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => setDatePickerOpen(true)}
                            activeOpacity={0.7}
                        >
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
