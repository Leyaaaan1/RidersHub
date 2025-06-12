import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import colors from "../styles/colors";

const ParticipantListModal = ({ visible, onClose, participants }) => (
    <Modal visible={visible} animationType="slide" transparent>
        <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{
                backgroundColor: '#222',
                borderRadius: 12,
                padding: 20,
                width: '90%'
            }}>
                <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                    <Text style={{ color: colors.white, fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
                <Text style={{ color: colors.white, fontSize: 18, marginBottom: 10 }}>Riders</Text>
                <View>
                    {Array.isArray(participants) ? (
                        <View style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 6, overflow: 'hidden' }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.10)', padding: 8 }}>
                                <Text style={{ flex: 0.2, color: '#fff', fontWeight: 'bold', textAlign: 'left', paddingLeft: 5 }}>#</Text>
                                <Text style={{ flex: 0.8, color: '#fff', fontWeight: 'bold', textAlign: 'left' }}>Username</Text>
                            </View>
                            {participants.map((participant, index) => (
                                <View key={index} style={{
                                    flexDirection: 'row',
                                    padding: 8,
                                    borderBottomWidth: index < participants.length - 1 ? 1 : 0,
                                    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
                                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                                }}>
                                    <Text style={{ flex: 0.2, color: '#fff', textAlign: 'left', paddingLeft: 5 }}>{index + 1}</Text>
                                    <Text style={{ flex: 0.8, color: '#fff', textAlign: 'left' }}>{typeof participant === 'object' ? participant.username : participant}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: '#fff', textAlign: 'left' }}>{participants}</Text>
                    )}
                </View>
            </View>
        </View>
    </Modal>
);

export default ParticipantListModal;