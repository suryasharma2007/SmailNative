import React, { useState, useEffect, useContext } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  ArrowLeft,
  Users,
  Plus,
  UserPlus,
  Trash2,
  Shield,
  AtSign,
  
} from 'lucide-react-native';

const { Store } = require('./AllPages');

import {
  listenToMyGroups,
  createNewGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup,
} from './FireBase';

const SmailGroups = ({ navigation }) => {
  const { Exstyles, setPage, userUid, triggerAlert , booleanValue , setBooleanValue } = useContext(Store);

  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  // =========================
  // LISTEN GROUPS
  // =========================

  useEffect(() => {
    if (userUid) {
      const unsubscribe = listenToMyGroups(userUid, setGroups);

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [userUid]);

  // =========================
  // CREATE GROUP
  // =========================

  const handleCreateGroup = async () => {
    setBooleanValue({
      ...booleanValue,
      sent: false,
    });
    if (!groupName.trim()) {
      return triggerAlert('Group name is required');
    }

    const cleanGroupName = groupName.trim().toLowerCase();

    const fullGroupId = `${cleanGroupName}-group@smails.in`;

    // setIsLoading(true);

    const res = await createNewGroup(fullGroupId, userUid);

    //setIsLoading(false);

    if (res.success) {
      triggerAlert('Group Created: ' + fullGroupId);
      setBooleanValue({
      ...booleanValue,
      sent: true ,
    });
      setGroupName('');
      setShowCreate(false);
    } else {
      triggerAlert(res.error);
      setBooleanValue({
      ...booleanValue,
      sent: true ,
    });
    }
  };

  // =========================
  // ADD MEMBER
  // =========================

  const handleAddMember = async groupId => {
    if (!newMemberEmail.trim()) {
      return triggerAlert('Enter member smail');
    }

    //setIsLoading(true);

    const res = await addMemberToGroup(groupId, newMemberEmail, userUid);

    //setIsLoading(false);

    if (res.success) {
      triggerAlert('Member Added!');

      setNewMemberEmail('');
    } else {
      triggerAlert(res.error);
    }
  };

  // =========================
  // REMOVE MEMBER
  // =========================

  const handleRemoveMember = (groupId, memberUid) => {
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',

          onPress: async () => {
            //setIsLoading(true);

            const res = await removeMemberFromGroup(
              groupId,
              memberUid,
              userUid,
            );

            // setIsLoading(false);

            if (res.success) {
              triggerAlert('Member removed successfully!');
            } else {
              triggerAlert(res.error);
            }
          },
        },
      ],
    );
  };

  // =========================
  // DELETE GROUP
  // =========================

  const handleDeleteGroup = groupId => {
    Alert.alert('Delete Group', 'Are you sure you want to delete this group?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',

        onPress: async () => {
          //setIsLoading(true);

          const res = await deleteGroup(groupId, userUid);

          //setIsLoading(false);

          if (res?.success) {
            triggerAlert('Group deleted successfully!');
          } else if (res?.error) {
            triggerAlert(res.error);
          }
        },
      },
    ]);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <View style={Exstyles.SmailGroupsPage}>
      {/* =================================
          UNIQUE HEADER
      ================================= */}

      <View
        style={{
          // position: "absolute" ,
          flex: 0.2,
          flexDirection: 'row',
          margin: 5,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 5,
        }}
      >
        <TouchableOpacity
          style={Exstyles.SmailGroupsHeaderButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} style={Exstyles.lucideIcons} />
        </TouchableOpacity>

        <Text style={Exstyles.SmailGroupsHeaderTitle}>Smail Groups</Text>

        <TouchableOpacity
          style={Exstyles.SmailGroupsHeaderButton}
          onPress={() => setShowCreate(true)}
          activeOpacity={0.7}
        >
          <Plus size={24} style={Exstyles.lucideIcons} />
        </TouchableOpacity>
      </View>

      {/* =================================
          CONTENT
      ================================= */}

      <ScrollView
        style={Exstyles.SmailGroupsContent}
        contentContainerStyle={Exstyles.SmailGroupsContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* =================================
            CREATE GROUP BOX
        ================================= */}

        {showCreate && (
          <View style={Exstyles.SmailGroupsCreateCard}>
            <Text style={Exstyles.SmailGroupsCreateTitle}>New Group</Text>

            {/* Group Name Input */}

            <View style={Exstyles.SmailGroupsGroupInputWrapper}>
              <TextInput
                style={Exstyles.SmailGroupsGroupInput}
                placeholder="Group name"
                placeholderTextColor={"gray"}
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="none"
              />

              <Text style={Exstyles.SmailGroupsDomainHint}>
                -group@smails.in
              </Text>
            </View>

            {/* Buttons */}

            <View style={Exstyles.SmailGroupsButtonRow}>
              <TouchableOpacity
                style={Exstyles.SmailGroupsSecondaryButton}
                onPress={() => {
                  setShowCreate(false);
                  setGroupName('');
                }}
                activeOpacity={0.7}
              >
                <Text style={Exstyles.SmailGroupsSecondaryButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={Exstyles.SmailGroupsPrimaryButton}
                onPress={handleCreateGroup}
                activeOpacity={0.7}
              >
                {booleanValue.sent ?
                  <Text style={Exstyles.SmailGroupsPrimaryButtonText}>
                  Create
                </Text> : 
                <ActivityIndicator />
                }
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* =================================
            GROUP LIST
        ================================= */}

        <View style={Exstyles.SmailGroupsList}>
          {groups.length === 0 && (
            <Text style={Exstyles.SmailGroupsEmptyText}>No groups found</Text>
          )}

          {groups.map(group => (
            <View key={group.id} style={Exstyles.SmailGroupsGroupCard}>
              {/* ==========================
                  GROUP HEADER
              ========================== */}

              <TouchableOpacity
                style={Exstyles.SmailGroupsGroupInfo}
                onPress={() =>
                  setSelectedGroup(selectedGroup === group.id ? null : group.id)
                }
                activeOpacity={0.7}
              >
                {/* Icon */}

                <View style={Exstyles.SmailGroupsGroupIcon}>
                  <Users size={22} style={Exstyles.lucideIcons} />
                </View>

                {/* Details */}

                <View style={Exstyles.SmailGroupsGroupDetails}>
                  <Text style={Exstyles.SmailGroupsGroupName} numberOfLines={1}>
                    {group.id}
                  </Text>

                  <Text style={Exstyles.SmailGroupsGroupMembers}>
                    {group.members?.length || 0}
                    {' Members • '}
                    {group.adminUid === userUid ? 'Admin' : 'Member'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* =================================
                  GROUP MANAGEMENT
              ================================= */}

              {selectedGroup === group.id && (
                <View style={Exstyles.SmailGroupsManagement}>
                  {/* ==========================
                      ADD MEMBER
                  ========================== */}

                  {group.adminUid === userUid && (
                    <View style={Exstyles.SmailGroupsMemberAddBox}>
                      <TextInput
                        style={Exstyles.SmailGroupsMemberInput}
                        placeholder="Enter smail to add"
                        placeholderTextColor={"gray"}
                        value={newMemberEmail}
                        onChangeText={setNewMemberEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />

                      <TouchableOpacity
                        style={Exstyles.SmailGroupsAddMemberButton}
                        onPress={() => handleAddMember(group.id)}
                        activeOpacity={0.7}
                      >
                        <UserPlus size={20} style={Exstyles.lucideIcons} />
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* ==========================
                      MEMBERS
                  ========================== */}

                  <View style={Exstyles.SmailGroupsMembersList}>
                    {group.membersData?.map(member => (
                      <View
                        key={member.uid}
                        style={Exstyles.SmailGroupsMemberRow}
                      >
                        {/* Member Info */}

                        <View style={Exstyles.SmailGroupsMemberMeta}>
                          <AtSign
                            size={14}
                            style={Exstyles.lucideIcons}
                          />

                          <Text
                            style={Exstyles.SmailGroupsMemberEmail}
                            numberOfLines={1}
                          >
                            {member.smail}
                          </Text>

                          {/* Admin icon */}

                          {group.adminUid === member.uid && (
                            <Shield size={14} style={Exstyles.lucideIcons} />
                          )}
                        </View>

                        {/* Remove */}

                        {group.adminUid === userUid &&
                          member.uid !== userUid && (
                            <TouchableOpacity
                              style={Exstyles.SmailGroupsRemoveButton}
                              onPress={() =>
                                handleRemoveMember(group.id, member.uid)
                              }
                              activeOpacity={0.7}
                            >
                              <Trash2 size={16} color={"red"} />
                            </TouchableOpacity>
                          )}
                      </View>
                    ))}
                  </View>

                  {/* ==========================
                      DELETE GROUP
                  ========================== */}

                  {group.adminUid === userUid && (
                    <TouchableOpacity
                      style={Exstyles.SmailGroupsDeleteButton}
                      onPress={() => handleDeleteGroup(group.id)}
                      activeOpacity={0.7}
                    >
                      <Trash2 size={16} style={Exstyles.dangerColor} />

                      <Text style={Exstyles.SmailGroupsDeleteText}>
                        Delete Group
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* =================================
          UNIQUE FOOTER
      ================================= */}

      <View style={Exstyles.SmailGroupsFooter}>
        <Text style={Exstyles.SmailGroupsFooterText}>Smail Groups</Text>
      </View>
    </View>
  );
};

export default SmailGroups;
