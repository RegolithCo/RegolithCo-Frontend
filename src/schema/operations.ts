import * as types from '@regolithco/common'
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  userId
  scName
  avatarUrl
  createdAt
  updatedAt
  state
}
    `;
export const WorkOrderListFragmentFragmentDoc = gql`
    fragment WorkOrderListFragment on WorkOrderInterface {
  orderId
  sessionId
  createdAt
  updatedAt
  ownerId
  sellerscName
  sellerUserId
  seller {
    ...UserFragment
  }
  state
  failReason
  isSold
  includeTransferFee
  orderType
  note
}
    ${UserFragmentFragmentDoc}`;
export const ScoutingIdFragmentFragmentDoc = gql`
    fragment ScoutingIdFragment on ScoutingFindInterface {
  sessionId
  scoutingFindId
  updatedAt
  state
  attendanceIds
  attendance {
    sessionId
    ownerId
  }
}
    `;
export const WorkOrderIdFragmentFragmentDoc = gql`
    fragment WorkOrderIdFragment on WorkOrderInterface {
  orderId
  isSold
  sessionId
  updatedAt
  failReason
  ownerId
  sellerscName
  sellerUserId
  seller {
    ...UserFragment
  }
  shareAmount
  sellStore
  state
}
    ${UserFragmentFragmentDoc}`;
export const SessionIdFragmentFragmentDoc = gql`
    fragment SessionIdFragment on Session {
  sessionId
  updatedAt
  state
  name
}
    `;
export const SessionUsersFragmentFragmentDoc = gql`
    fragment SessionUsersFragment on Session {
  activeMembers {
    items {
      ownerId
      sessionId
      sessionRole
      shipRole
      owner {
        userId
        scName
        avatarUrl
      }
    }
  }
}
    `;
export const SessionWorkOrderStatusFragmentFragmentDoc = gql`
    fragment SessionWorkOrderStatusFragment on WorkOrderInterface {
  orderId
  isSold
  orderType
}
    `;
export const SessionSettingFragmentFragmentDoc = gql`
    fragment SessionSettingFragment on SessionSettings {
  activity
  allowUnverifiedUsers
  usersCanAddUsers
  usersCanInviteUsers
  controlledSessionRole
  controlledShipRole
  lockToDiscordGuild {
    iconUrl
    id
    name
  }
  gravityWell
  location
  systemFilter
  lockedFields
  specifyUsers
  workOrderDefaults {
    includeTransferFee
    crewShares {
      note
      payeeScName
      share
      shareType
    }
    lockedFields
    isRefined
    refinery
    shareRefinedValue
    method
    shipOres
    vehicleOres
    salvageOres
  }
}
    `;
export const SessionListFragmentFragmentDoc = gql`
    fragment SessionListFragment on Session {
  sessionId
  name
  onTheList
  ownerId
  owner {
    ...UserFragment
  }
  sessionSettings {
    ...SessionSettingFragment
  }
  createdAt
  updatedAt
  finishedAt
  state
  note
}
    ${UserFragmentFragmentDoc}
${SessionSettingFragmentFragmentDoc}`;
export const SessionSummaryFragmentFragmentDoc = gql`
    fragment SessionSummaryFragment on Session {
  summary {
    aUEC
    oreSCU
    allPaid
    lastJobDone
    refineries
    activeMembers
    totalMembers
    workOrdersByType {
      other
      salvage
      ship
      vehicle
    }
    scoutingFindsByType {
      salvage
      ship
      vehicle
    }
    workOrderSummaries {
      orderType
      isSold
      isFailed
      unpaidShares
      paidShares
    }
  }
}
    `;
export const SessionUpdateFragmentFragmentDoc = gql`
    fragment SessionUpdateFragment on Session {
  sessionId
  name
  onTheList
  ownerId
  owner {
    ...UserFragment
  }
  createdAt
  updatedAt
  finishedAt
  state
  note
  sessionSettings {
    ...SessionSettingFragment
  }
  ...SessionSummaryFragment
}
    ${UserFragmentFragmentDoc}
${SessionSettingFragmentFragmentDoc}
${SessionSummaryFragmentFragmentDoc}`;
export const SessionBaseFragmentFragmentDoc = gql`
    fragment SessionBaseFragment on Session {
  sessionId
  joinId
  name
  onTheList
  ownerId
  owner {
    ...UserFragment
  }
  createdAt
  updatedAt
  finishedAt
  note
  sessionSettings {
    ...SessionSettingFragment
  }
  mentionedUsers {
    scName
    captainId
    sessionRole
    shipRole
  }
  ...SessionSummaryFragment
}
    ${UserFragmentFragmentDoc}
${SessionSettingFragmentFragmentDoc}
${SessionSummaryFragmentFragmentDoc}`;
export const MiningLoadoutFragmentFragmentDoc = gql`
    fragment MiningLoadoutFragment on MiningLoadout {
  loadoutId
  name
  createdAt
  updatedAt
  ship
  activeLasers {
    laser
    laserActive
    modules
    modulesActive
  }
  owner {
    userId
  }
  activeGadgetIndex
  inventoryLasers
  inventoryModules
  inventoryGadgets
}
    `;
export const SessionUserBaseFragmentFragmentDoc = gql`
    fragment SessionUserBaseFragment on SessionUser {
  sessionId
  ownerId
  sessionRole
  shipRole
  owner {
    ...UserFragment
  }
  createdAt
  updatedAt
  isPilot
  captainId
  shipName
  vehicleCode
  loadout {
    ...MiningLoadoutFragment
  }
}
    ${UserFragmentFragmentDoc}
${MiningLoadoutFragmentFragmentDoc}`;
export const SessionUserFragmentFragmentDoc = gql`
    fragment SessionUserFragment on SessionUser {
  ...SessionUserBaseFragment
  state
}
    ${SessionUserBaseFragmentFragmentDoc}`;
export const ShipRockFragmentFragmentDoc = gql`
    fragment ShipRockFragment on ShipRock {
  mass
  inst
  res
  state
  ores {
    ore
    percent
  }
}
    `;
export const ScoutingFindBaseFragmentFragmentDoc = gql`
    fragment ScoutingFindBaseFragment on ScoutingFindInterface {
  sessionId
  scoutingFindId
  createdAt
  updatedAt
  clusterType
  clusterCount
  ownerId
  owner {
    ...UserFragment
  }
  note
  attendanceIds
  ... on ShipClusterFind {
    shipRocks {
      ...ShipRockFragment
    }
  }
  ... on VehicleClusterFind {
    vehicleRocks {
      mass
      inst
      res
      ores {
        ore
        percent
      }
    }
  }
  ... on SalvageFind {
    wrecks {
      state
      isShip
      shipCode
      salvageOres {
        ore
        scu
      }
      sellableAUEC
    }
  }
}
    ${UserFragmentFragmentDoc}
${ShipRockFragmentFragmentDoc}`;
export const ScoutingFindFragmentFragmentDoc = gql`
    fragment ScoutingFindFragment on ScoutingFindInterface {
  ...ScoutingFindBaseFragment
  state
  attendance {
    ...SessionUserFragment
  }
}
    ${ScoutingFindBaseFragmentFragmentDoc}
${SessionUserFragmentFragmentDoc}`;
export const WorkOrderBaseFragmentFragmentDoc = gql`
    fragment WorkOrderBaseFragment on WorkOrderInterface {
  orderId
  sessionId
  createdAt
  updatedAt
  ownerId
  isSold
  sellerscName
  sellerUserId
  seller {
    ...UserFragment
  }
  owner {
    ...UserFragment
  }
  failReason
  includeTransferFee
  orderType
  note
  shareAmount
  sellStore
  expenses {
    amount
    name
  }
  isSold
  ... on ShipMiningOrder {
    isRefined
    shareRefinedValue
    refinery
    method
    processStartTime
    processDurationS
    shipOres {
      amt
      ore
    }
  }
  ... on VehicleMiningOrder {
    vehicleOres {
      ore
      amt
    }
  }
  ... on SalvageOrder {
    salvageOres {
      ore
      amt
    }
  }
}
    ${UserFragmentFragmentDoc}`;
export const CrewShareBaseFragmentFragmentDoc = gql`
    fragment CrewShareBaseFragment on CrewShare {
  sessionId
  payeeScName
  payeeUserId
  orderId
  shareType
  share
  note
  createdAt
  updatedAt
}
    `;
export const CrewShareFragmentFragmentDoc = gql`
    fragment CrewShareFragment on CrewShare {
  ...CrewShareBaseFragment
  state
}
    ${CrewShareBaseFragmentFragmentDoc}`;
export const WorkOrderFragmentFragmentDoc = gql`
    fragment WorkOrderFragment on WorkOrderInterface {
  ...WorkOrderBaseFragment
  state
  crewShares {
    ...CrewShareFragment
  }
}
    ${WorkOrderBaseFragmentFragmentDoc}
${CrewShareFragmentFragmentDoc}`;
export const SessionFragmentFragmentDoc = gql`
    fragment SessionFragment on Session {
  ...SessionBaseFragment
  state
  activeMemberIds
  activeMembers {
    items {
      ...SessionUserFragment
    }
    nextToken
  }
  scouting {
    items {
      ...ScoutingFindFragment
    }
    nextToken
  }
  workOrders {
    items {
      ...WorkOrderFragment
    }
    nextToken
  }
}
    ${SessionBaseFragmentFragmentDoc}
${SessionUserFragmentFragmentDoc}
${ScoutingFindFragmentFragmentDoc}
${WorkOrderFragmentFragmentDoc}`;
export const SessionShareFragmentFragmentDoc = gql`
    fragment SessionShareFragment on SessionShare {
  sessionId
  name
  createdAt
  updatedAt
  finishedAt
  state
  note
  onTheList
  activity
  specifyUsers
  allowUnverifiedUsers
  lockToDiscordGuild {
    iconUrl
    id
    name
  }
}
    `;
export const SessionActiveMembersFragmentFragmentDoc = gql`
    fragment SessionActiveMembersFragment on Session {
  sessionId
  activeMembers(nextToken: $nextToken) {
    items {
      ...SessionUserFragment
    }
    nextToken
  }
}
    ${SessionUserFragmentFragmentDoc}`;
export const SessionScoutingFragmentFragmentDoc = gql`
    fragment SessionScoutingFragment on Session {
  sessionId
  scouting(nextToken: $nextToken) {
    items {
      ...ScoutingFindFragment
    }
    nextToken
  }
}
    ${ScoutingFindFragmentFragmentDoc}`;
export const SessionWorkOrdersFragmentFragmentDoc = gql`
    fragment SessionWorkOrdersFragment on Session {
  sessionId
  workOrders(nextToken: $nextToken) {
    items {
      ...WorkOrderFragment
    }
    nextToken
  }
}
    ${WorkOrderFragmentFragmentDoc}`;
export const VehicleFragmentFragmentDoc = gql`
    fragment VehicleFragment on Vehicle {
  maker
  name
  UEXID
  cargo
  miningHold
  role
}
    `;
export const UserProfileFragmentFragmentDoc = gql`
    fragment UserProfileFragment on UserProfile {
  userId
  scName
  avatarUrl
  createdAt
  updatedAt
  lastActive
  plan
  apiKey
  state
  verifyCode
  sessionShipCode
  deliveryShipCode
  loadouts {
    ...MiningLoadoutFragment
  }
  sessionSettings {
    ...SessionSettingFragment
  }
  userSettings
  friends
  surveyorName
  surveyorScore
  isSurveyor
  isSurveyorBanned
}
    ${MiningLoadoutFragmentFragmentDoc}
${SessionSettingFragmentFragmentDoc}`;
export const UserProfileLoadoutFragmentFragmentDoc = gql`
    fragment UserProfileLoadoutFragment on UserProfile {
  userId
  scName
  loadouts {
    ...MiningLoadoutFragment
  }
}
    ${MiningLoadoutFragmentFragmentDoc}`;
export const UpsertUserDocument = gql`
    mutation upsertUser($userProfile: UserProfileInput!, $sessionSettings: SessionSettingsInput, $workOrderDefaults: WorkOrderDefaultsInput, $crewSharesDefaults: [CrewShareTemplateInput!], $shipOreDefaults: [ShipOreEnum!], $vehicleOreDefaults: [VehicleOreEnum!], $salvageOreDefaults: [SalvageOreEnum!]) {
  updateUserProfile(
    userProfile: $userProfile
    sessionSettings: $sessionSettings
    workOrderDefaults: $workOrderDefaults
    crewSharesDefaults: $crewSharesDefaults
    shipOreDefaults: $shipOreDefaults
    vehicleOreDefaults: $vehicleOreDefaults
    salvageOreDefaults: $salvageOreDefaults
  ) {
    ...UserProfileFragment
  }
}
    ${UserProfileFragmentFragmentDoc}`;
export type UpsertUserMutationFn = Apollo.MutationFunction<types.UpsertUserMutation, types.UpsertUserMutationVariables>;

/**
 * __useUpsertUserMutation__
 *
 * To run a mutation, you first call `useUpsertUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertUserMutation, { data, loading, error }] = useUpsertUserMutation({
 *   variables: {
 *      userProfile: // value for 'userProfile'
 *      sessionSettings: // value for 'sessionSettings'
 *      workOrderDefaults: // value for 'workOrderDefaults'
 *      crewSharesDefaults: // value for 'crewSharesDefaults'
 *      shipOreDefaults: // value for 'shipOreDefaults'
 *      vehicleOreDefaults: // value for 'vehicleOreDefaults'
 *      salvageOreDefaults: // value for 'salvageOreDefaults'
 *   },
 * });
 */
export function useUpsertUserMutation(baseOptions?: Apollo.MutationHookOptions<types.UpsertUserMutation, types.UpsertUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpsertUserMutation, types.UpsertUserMutationVariables>(UpsertUserDocument, options);
      }
export type UpsertUserMutationHookResult = ReturnType<typeof useUpsertUserMutation>;
export type UpsertUserMutationResult = Apollo.MutationResult<types.UpsertUserMutation>;
export type UpsertUserMutationOptions = Apollo.BaseMutationOptions<types.UpsertUserMutation, types.UpsertUserMutationVariables>;
export const RefreshAvatarDocument = gql`
    mutation refreshAvatar($remove: Boolean) {
  refreshAvatar(remove: $remove) {
    userId
    scName
    avatarUrl
  }
}
    `;
export type RefreshAvatarMutationFn = Apollo.MutationFunction<types.RefreshAvatarMutation, types.RefreshAvatarMutationVariables>;

/**
 * __useRefreshAvatarMutation__
 *
 * To run a mutation, you first call `useRefreshAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshAvatarMutation, { data, loading, error }] = useRefreshAvatarMutation({
 *   variables: {
 *      remove: // value for 'remove'
 *   },
 * });
 */
export function useRefreshAvatarMutation(baseOptions?: Apollo.MutationHookOptions<types.RefreshAvatarMutation, types.RefreshAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.RefreshAvatarMutation, types.RefreshAvatarMutationVariables>(RefreshAvatarDocument, options);
      }
export type RefreshAvatarMutationHookResult = ReturnType<typeof useRefreshAvatarMutation>;
export type RefreshAvatarMutationResult = Apollo.MutationResult<types.RefreshAvatarMutation>;
export type RefreshAvatarMutationOptions = Apollo.BaseMutationOptions<types.RefreshAvatarMutation, types.RefreshAvatarMutationVariables>;
export const DeleteUserProfileDocument = gql`
    mutation deleteUserProfile($leaveData: Boolean) {
  deleteUserProfile(leaveData: $leaveData)
}
    `;
export type DeleteUserProfileMutationFn = Apollo.MutationFunction<types.DeleteUserProfileMutation, types.DeleteUserProfileMutationVariables>;

/**
 * __useDeleteUserProfileMutation__
 *
 * To run a mutation, you first call `useDeleteUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserProfileMutation, { data, loading, error }] = useDeleteUserProfileMutation({
 *   variables: {
 *      leaveData: // value for 'leaveData'
 *   },
 * });
 */
export function useDeleteUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<types.DeleteUserProfileMutation, types.DeleteUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeleteUserProfileMutation, types.DeleteUserProfileMutationVariables>(DeleteUserProfileDocument, options);
      }
export type DeleteUserProfileMutationHookResult = ReturnType<typeof useDeleteUserProfileMutation>;
export type DeleteUserProfileMutationResult = Apollo.MutationResult<types.DeleteUserProfileMutation>;
export type DeleteUserProfileMutationOptions = Apollo.BaseMutationOptions<types.DeleteUserProfileMutation, types.DeleteUserProfileMutationVariables>;
export const RequestAccountVerifyDocument = gql`
    mutation requestAccountVerify {
  requestVerifyUserProfile
}
    `;
export type RequestAccountVerifyMutationFn = Apollo.MutationFunction<types.RequestAccountVerifyMutation, types.RequestAccountVerifyMutationVariables>;

/**
 * __useRequestAccountVerifyMutation__
 *
 * To run a mutation, you first call `useRequestAccountVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestAccountVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestAccountVerifyMutation, { data, loading, error }] = useRequestAccountVerifyMutation({
 *   variables: {
 *   },
 * });
 */
export function useRequestAccountVerifyMutation(baseOptions?: Apollo.MutationHookOptions<types.RequestAccountVerifyMutation, types.RequestAccountVerifyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.RequestAccountVerifyMutation, types.RequestAccountVerifyMutationVariables>(RequestAccountVerifyDocument, options);
      }
export type RequestAccountVerifyMutationHookResult = ReturnType<typeof useRequestAccountVerifyMutation>;
export type RequestAccountVerifyMutationResult = Apollo.MutationResult<types.RequestAccountVerifyMutation>;
export type RequestAccountVerifyMutationOptions = Apollo.BaseMutationOptions<types.RequestAccountVerifyMutation, types.RequestAccountVerifyMutationVariables>;
export const VerifyUserDocument = gql`
    mutation verifyUser {
  verifyUserProfile {
    userId
    scName
    avatarUrl
    state
    verifyCode
  }
}
    `;
export type VerifyUserMutationFn = Apollo.MutationFunction<types.VerifyUserMutation, types.VerifyUserMutationVariables>;

/**
 * __useVerifyUserMutation__
 *
 * To run a mutation, you first call `useVerifyUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyUserMutation, { data, loading, error }] = useVerifyUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useVerifyUserMutation(baseOptions?: Apollo.MutationHookOptions<types.VerifyUserMutation, types.VerifyUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.VerifyUserMutation, types.VerifyUserMutationVariables>(VerifyUserDocument, options);
      }
export type VerifyUserMutationHookResult = ReturnType<typeof useVerifyUserMutation>;
export type VerifyUserMutationResult = Apollo.MutationResult<types.VerifyUserMutation>;
export type VerifyUserMutationOptions = Apollo.BaseMutationOptions<types.VerifyUserMutation, types.VerifyUserMutationVariables>;
export const UpsertApiKeyDocument = gql`
    mutation upsertAPIKey {
  userAPIKey {
    userId
    scName
    apiKey
  }
}
    `;
export type UpsertApiKeyMutationFn = Apollo.MutationFunction<types.UpsertApiKeyMutation, types.UpsertApiKeyMutationVariables>;

/**
 * __useUpsertApiKeyMutation__
 *
 * To run a mutation, you first call `useUpsertApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertApiKeyMutation, { data, loading, error }] = useUpsertApiKeyMutation({
 *   variables: {
 *   },
 * });
 */
export function useUpsertApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<types.UpsertApiKeyMutation, types.UpsertApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpsertApiKeyMutation, types.UpsertApiKeyMutationVariables>(UpsertApiKeyDocument, options);
      }
export type UpsertApiKeyMutationHookResult = ReturnType<typeof useUpsertApiKeyMutation>;
export type UpsertApiKeyMutationResult = Apollo.MutationResult<types.UpsertApiKeyMutation>;
export type UpsertApiKeyMutationOptions = Apollo.BaseMutationOptions<types.UpsertApiKeyMutation, types.UpsertApiKeyMutationVariables>;
export const DeletApiKeyDocument = gql`
    mutation deletAPIKey {
  userAPIKey(revoke: true) {
    userId
    scName
    apiKey
  }
}
    `;
export type DeletApiKeyMutationFn = Apollo.MutationFunction<types.DeletApiKeyMutation, types.DeletApiKeyMutationVariables>;

/**
 * __useDeletApiKeyMutation__
 *
 * To run a mutation, you first call `useDeletApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletApiKeyMutation, { data, loading, error }] = useDeletApiKeyMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeletApiKeyMutation(baseOptions?: Apollo.MutationHookOptions<types.DeletApiKeyMutation, types.DeletApiKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeletApiKeyMutation, types.DeletApiKeyMutationVariables>(DeletApiKeyDocument, options);
      }
export type DeletApiKeyMutationHookResult = ReturnType<typeof useDeletApiKeyMutation>;
export type DeletApiKeyMutationResult = Apollo.MutationResult<types.DeletApiKeyMutation>;
export type DeletApiKeyMutationOptions = Apollo.BaseMutationOptions<types.DeletApiKeyMutation, types.DeletApiKeyMutationVariables>;
export const AddFriendsDocument = gql`
    mutation addFriends($friends: [String]!) {
  addFriends(friends: $friends) {
    userId
    updatedAt
    scName
    friends
  }
}
    `;
export type AddFriendsMutationFn = Apollo.MutationFunction<types.AddFriendsMutation, types.AddFriendsMutationVariables>;

/**
 * __useAddFriendsMutation__
 *
 * To run a mutation, you first call `useAddFriendsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFriendsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFriendsMutation, { data, loading, error }] = useAddFriendsMutation({
 *   variables: {
 *      friends: // value for 'friends'
 *   },
 * });
 */
export function useAddFriendsMutation(baseOptions?: Apollo.MutationHookOptions<types.AddFriendsMutation, types.AddFriendsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.AddFriendsMutation, types.AddFriendsMutationVariables>(AddFriendsDocument, options);
      }
export type AddFriendsMutationHookResult = ReturnType<typeof useAddFriendsMutation>;
export type AddFriendsMutationResult = Apollo.MutationResult<types.AddFriendsMutation>;
export type AddFriendsMutationOptions = Apollo.BaseMutationOptions<types.AddFriendsMutation, types.AddFriendsMutationVariables>;
export const RemoveFriendsDocument = gql`
    mutation removeFriends($friends: [String]!) {
  removeFriends(friends: $friends) {
    userId
    updatedAt
    scName
    friends
  }
}
    `;
export type RemoveFriendsMutationFn = Apollo.MutationFunction<types.RemoveFriendsMutation, types.RemoveFriendsMutationVariables>;

/**
 * __useRemoveFriendsMutation__
 *
 * To run a mutation, you first call `useRemoveFriendsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFriendsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFriendsMutation, { data, loading, error }] = useRemoveFriendsMutation({
 *   variables: {
 *      friends: // value for 'friends'
 *   },
 * });
 */
export function useRemoveFriendsMutation(baseOptions?: Apollo.MutationHookOptions<types.RemoveFriendsMutation, types.RemoveFriendsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.RemoveFriendsMutation, types.RemoveFriendsMutationVariables>(RemoveFriendsDocument, options);
      }
export type RemoveFriendsMutationHookResult = ReturnType<typeof useRemoveFriendsMutation>;
export type RemoveFriendsMutationResult = Apollo.MutationResult<types.RemoveFriendsMutation>;
export type RemoveFriendsMutationOptions = Apollo.BaseMutationOptions<types.RemoveFriendsMutation, types.RemoveFriendsMutationVariables>;
export const CreateWorkOrderDocument = gql`
    mutation createWorkOrder($sessionId: ID!, $workOrder: WorkOrderInput!, $shipOres: [RefineryRowInput!], $vehicleOres: [VehicleMiningRowInput!], $salvageOres: [SalvageRowInput!], $shares: [CrewShareInput!]!) {
  createWorkOrder(
    sessionId: $sessionId
    workOrder: $workOrder
    shipOres: $shipOres
    vehicleOres: $vehicleOres
    salvageOres: $salvageOres
    shares: $shares
  ) {
    ...WorkOrderFragment
  }
}
    ${WorkOrderFragmentFragmentDoc}`;
export type CreateWorkOrderMutationFn = Apollo.MutationFunction<types.CreateWorkOrderMutation, types.CreateWorkOrderMutationVariables>;

/**
 * __useCreateWorkOrderMutation__
 *
 * To run a mutation, you first call `useCreateWorkOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkOrderMutation, { data, loading, error }] = useCreateWorkOrderMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      workOrder: // value for 'workOrder'
 *      shipOres: // value for 'shipOres'
 *      vehicleOres: // value for 'vehicleOres'
 *      salvageOres: // value for 'salvageOres'
 *      shares: // value for 'shares'
 *   },
 * });
 */
export function useCreateWorkOrderMutation(baseOptions?: Apollo.MutationHookOptions<types.CreateWorkOrderMutation, types.CreateWorkOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.CreateWorkOrderMutation, types.CreateWorkOrderMutationVariables>(CreateWorkOrderDocument, options);
      }
export type CreateWorkOrderMutationHookResult = ReturnType<typeof useCreateWorkOrderMutation>;
export type CreateWorkOrderMutationResult = Apollo.MutationResult<types.CreateWorkOrderMutation>;
export type CreateWorkOrderMutationOptions = Apollo.BaseMutationOptions<types.CreateWorkOrderMutation, types.CreateWorkOrderMutationVariables>;
export const UpdateWorkOrderDocument = gql`
    mutation updateWorkOrder($sessionId: ID!, $orderId: ID!, $workOrder: WorkOrderInput!, $shipOres: [RefineryRowInput!], $vehicleOres: [VehicleMiningRowInput!], $salvageOres: [SalvageRowInput!], $shares: [CrewShareInput!]) {
  updateWorkOrder(
    sessionId: $sessionId
    orderId: $orderId
    workOrder: $workOrder
    shipOres: $shipOres
    vehicleOres: $vehicleOres
    salvageOres: $salvageOres
    shares: $shares
  ) {
    ...WorkOrderFragment
  }
}
    ${WorkOrderFragmentFragmentDoc}`;
export type UpdateWorkOrderMutationFn = Apollo.MutationFunction<types.UpdateWorkOrderMutation, types.UpdateWorkOrderMutationVariables>;

/**
 * __useUpdateWorkOrderMutation__
 *
 * To run a mutation, you first call `useUpdateWorkOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkOrderMutation, { data, loading, error }] = useUpdateWorkOrderMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *      workOrder: // value for 'workOrder'
 *      shipOres: // value for 'shipOres'
 *      vehicleOres: // value for 'vehicleOres'
 *      salvageOres: // value for 'salvageOres'
 *      shares: // value for 'shares'
 *   },
 * });
 */
export function useUpdateWorkOrderMutation(baseOptions?: Apollo.MutationHookOptions<types.UpdateWorkOrderMutation, types.UpdateWorkOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpdateWorkOrderMutation, types.UpdateWorkOrderMutationVariables>(UpdateWorkOrderDocument, options);
      }
export type UpdateWorkOrderMutationHookResult = ReturnType<typeof useUpdateWorkOrderMutation>;
export type UpdateWorkOrderMutationResult = Apollo.MutationResult<types.UpdateWorkOrderMutation>;
export type UpdateWorkOrderMutationOptions = Apollo.BaseMutationOptions<types.UpdateWorkOrderMutation, types.UpdateWorkOrderMutationVariables>;
export const FailWorkOrderDocument = gql`
    mutation failWorkOrder($sessionId: ID!, $orderId: ID!, $reason: String) {
  failWorkOrder(sessionId: $sessionId, orderId: $orderId, reason: $reason) {
    ...WorkOrderFragment
  }
}
    ${WorkOrderFragmentFragmentDoc}`;
export type FailWorkOrderMutationFn = Apollo.MutationFunction<types.FailWorkOrderMutation, types.FailWorkOrderMutationVariables>;

/**
 * __useFailWorkOrderMutation__
 *
 * To run a mutation, you first call `useFailWorkOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFailWorkOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [failWorkOrderMutation, { data, loading, error }] = useFailWorkOrderMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useFailWorkOrderMutation(baseOptions?: Apollo.MutationHookOptions<types.FailWorkOrderMutation, types.FailWorkOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.FailWorkOrderMutation, types.FailWorkOrderMutationVariables>(FailWorkOrderDocument, options);
      }
export type FailWorkOrderMutationHookResult = ReturnType<typeof useFailWorkOrderMutation>;
export type FailWorkOrderMutationResult = Apollo.MutationResult<types.FailWorkOrderMutation>;
export type FailWorkOrderMutationOptions = Apollo.BaseMutationOptions<types.FailWorkOrderMutation, types.FailWorkOrderMutationVariables>;
export const DeliverWorkOrderDocument = gql`
    mutation deliverWorkOrder($sessionId: ID!, $orderId: ID!, $isSold: Boolean!) {
  deliverWorkOrder(sessionId: $sessionId, orderId: $orderId, isSold: $isSold) {
    ...WorkOrderFragment
  }
}
    ${WorkOrderFragmentFragmentDoc}`;
export type DeliverWorkOrderMutationFn = Apollo.MutationFunction<types.DeliverWorkOrderMutation, types.DeliverWorkOrderMutationVariables>;

/**
 * __useDeliverWorkOrderMutation__
 *
 * To run a mutation, you first call `useDeliverWorkOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeliverWorkOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deliverWorkOrderMutation, { data, loading, error }] = useDeliverWorkOrderMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *      isSold: // value for 'isSold'
 *   },
 * });
 */
export function useDeliverWorkOrderMutation(baseOptions?: Apollo.MutationHookOptions<types.DeliverWorkOrderMutation, types.DeliverWorkOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeliverWorkOrderMutation, types.DeliverWorkOrderMutationVariables>(DeliverWorkOrderDocument, options);
      }
export type DeliverWorkOrderMutationHookResult = ReturnType<typeof useDeliverWorkOrderMutation>;
export type DeliverWorkOrderMutationResult = Apollo.MutationResult<types.DeliverWorkOrderMutation>;
export type DeliverWorkOrderMutationOptions = Apollo.BaseMutationOptions<types.DeliverWorkOrderMutation, types.DeliverWorkOrderMutationVariables>;
export const DeleteWorkOrderDocument = gql`
    mutation deleteWorkOrder($sessionId: ID!, $orderId: ID!) {
  deleteWorkOrder(sessionId: $sessionId, orderId: $orderId) {
    ... on WorkOrderInterface {
      sessionId
      orderId
    }
  }
}
    `;
export type DeleteWorkOrderMutationFn = Apollo.MutationFunction<types.DeleteWorkOrderMutation, types.DeleteWorkOrderMutationVariables>;

/**
 * __useDeleteWorkOrderMutation__
 *
 * To run a mutation, you first call `useDeleteWorkOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWorkOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWorkOrderMutation, { data, loading, error }] = useDeleteWorkOrderMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *   },
 * });
 */
export function useDeleteWorkOrderMutation(baseOptions?: Apollo.MutationHookOptions<types.DeleteWorkOrderMutation, types.DeleteWorkOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeleteWorkOrderMutation, types.DeleteWorkOrderMutationVariables>(DeleteWorkOrderDocument, options);
      }
export type DeleteWorkOrderMutationHookResult = ReturnType<typeof useDeleteWorkOrderMutation>;
export type DeleteWorkOrderMutationResult = Apollo.MutationResult<types.DeleteWorkOrderMutation>;
export type DeleteWorkOrderMutationOptions = Apollo.BaseMutationOptions<types.DeleteWorkOrderMutation, types.DeleteWorkOrderMutationVariables>;
export const CreateSessionDocument = gql`
    mutation createSession($session: SessionInput!, $sessionSettings: SessionSettingsInput, $workOrderDefaults: WorkOrderDefaultsInput, $crewSharesDefaults: [CrewShareTemplateInput!], $shipOreDefaults: [ShipOreEnum!], $vehicleOreDefaults: [VehicleOreEnum!], $salvageOreDefaults: [SalvageOreEnum!]) {
  createSession(
    session: $session
    sessionSettings: $sessionSettings
    workOrderDefaults: $workOrderDefaults
    crewSharesDefaults: $crewSharesDefaults
    shipOreDefaults: $shipOreDefaults
    vehicleOreDefaults: $vehicleOreDefaults
    salvageOreDefaults: $salvageOreDefaults
  ) {
    ...SessionUpdateFragment
    activeMemberIds
    joinId
    mentionedUsers {
      scName
      captainId
    }
    scouting {
      items {
        ...ScoutingFindFragment
      }
      nextToken
    }
    workOrders {
      items {
        ...WorkOrderFragment
      }
      nextToken
    }
    activeMembers {
      items {
        ...SessionUserFragment
      }
      nextToken
    }
  }
}
    ${SessionUpdateFragmentFragmentDoc}
${ScoutingFindFragmentFragmentDoc}
${WorkOrderFragmentFragmentDoc}
${SessionUserFragmentFragmentDoc}`;
export type CreateSessionMutationFn = Apollo.MutationFunction<types.CreateSessionMutation, types.CreateSessionMutationVariables>;

/**
 * __useCreateSessionMutation__
 *
 * To run a mutation, you first call `useCreateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSessionMutation, { data, loading, error }] = useCreateSessionMutation({
 *   variables: {
 *      session: // value for 'session'
 *      sessionSettings: // value for 'sessionSettings'
 *      workOrderDefaults: // value for 'workOrderDefaults'
 *      crewSharesDefaults: // value for 'crewSharesDefaults'
 *      shipOreDefaults: // value for 'shipOreDefaults'
 *      vehicleOreDefaults: // value for 'vehicleOreDefaults'
 *      salvageOreDefaults: // value for 'salvageOreDefaults'
 *   },
 * });
 */
export function useCreateSessionMutation(baseOptions?: Apollo.MutationHookOptions<types.CreateSessionMutation, types.CreateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.CreateSessionMutation, types.CreateSessionMutationVariables>(CreateSessionDocument, options);
      }
export type CreateSessionMutationHookResult = ReturnType<typeof useCreateSessionMutation>;
export type CreateSessionMutationResult = Apollo.MutationResult<types.CreateSessionMutation>;
export type CreateSessionMutationOptions = Apollo.BaseMutationOptions<types.CreateSessionMutation, types.CreateSessionMutationVariables>;
export const UpdateSessionDocument = gql`
    mutation updateSession($sessionId: ID!, $session: SessionInput!, $sessionSettings: SessionSettingsInput, $workOrderDefaults: WorkOrderDefaultsInput, $crewSharesDefaults: [CrewShareTemplateInput!], $shipOreDefaults: [ShipOreEnum!], $vehicleOreDefaults: [VehicleOreEnum!], $salvageOreDefaults: [SalvageOreEnum!]) {
  updateSession(
    sessionId: $sessionId
    session: $session
    sessionSettings: $sessionSettings
    workOrderDefaults: $workOrderDefaults
    crewSharesDefaults: $crewSharesDefaults
    shipOreDefaults: $shipOreDefaults
    vehicleOreDefaults: $vehicleOreDefaults
    salvageOreDefaults: $salvageOreDefaults
  ) {
    ...SessionUpdateFragment
  }
}
    ${SessionUpdateFragmentFragmentDoc}`;
export type UpdateSessionMutationFn = Apollo.MutationFunction<types.UpdateSessionMutation, types.UpdateSessionMutationVariables>;

/**
 * __useUpdateSessionMutation__
 *
 * To run a mutation, you first call `useUpdateSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSessionMutation, { data, loading, error }] = useUpdateSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      session: // value for 'session'
 *      sessionSettings: // value for 'sessionSettings'
 *      workOrderDefaults: // value for 'workOrderDefaults'
 *      crewSharesDefaults: // value for 'crewSharesDefaults'
 *      shipOreDefaults: // value for 'shipOreDefaults'
 *      vehicleOreDefaults: // value for 'vehicleOreDefaults'
 *      salvageOreDefaults: // value for 'salvageOreDefaults'
 *   },
 * });
 */
export function useUpdateSessionMutation(baseOptions?: Apollo.MutationHookOptions<types.UpdateSessionMutation, types.UpdateSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpdateSessionMutation, types.UpdateSessionMutationVariables>(UpdateSessionDocument, options);
      }
export type UpdateSessionMutationHookResult = ReturnType<typeof useUpdateSessionMutation>;
export type UpdateSessionMutationResult = Apollo.MutationResult<types.UpdateSessionMutation>;
export type UpdateSessionMutationOptions = Apollo.BaseMutationOptions<types.UpdateSessionMutation, types.UpdateSessionMutationVariables>;
export const AddSessionMentionsDocument = gql`
    mutation addSessionMentions($sessionId: ID!, $scNames: [String]!) {
  addSessionMentions(sessionId: $sessionId, scNames: $scNames) {
    sessionId
    updatedAt
    mentionedUsers {
      scName
      captainId
    }
  }
}
    `;
export type AddSessionMentionsMutationFn = Apollo.MutationFunction<types.AddSessionMentionsMutation, types.AddSessionMentionsMutationVariables>;

/**
 * __useAddSessionMentionsMutation__
 *
 * To run a mutation, you first call `useAddSessionMentionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSessionMentionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSessionMentionsMutation, { data, loading, error }] = useAddSessionMentionsMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scNames: // value for 'scNames'
 *   },
 * });
 */
export function useAddSessionMentionsMutation(baseOptions?: Apollo.MutationHookOptions<types.AddSessionMentionsMutation, types.AddSessionMentionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.AddSessionMentionsMutation, types.AddSessionMentionsMutationVariables>(AddSessionMentionsDocument, options);
      }
export type AddSessionMentionsMutationHookResult = ReturnType<typeof useAddSessionMentionsMutation>;
export type AddSessionMentionsMutationResult = Apollo.MutationResult<types.AddSessionMentionsMutation>;
export type AddSessionMentionsMutationOptions = Apollo.BaseMutationOptions<types.AddSessionMentionsMutation, types.AddSessionMentionsMutationVariables>;
export const RemoveSessionMentionsDocument = gql`
    mutation removeSessionMentions($sessionId: ID!, $scNames: [String]!) {
  removeSessionMentions(sessionId: $sessionId, scNames: $scNames) {
    sessionId
    updatedAt
    mentionedUsers {
      scName
      captainId
    }
  }
}
    `;
export type RemoveSessionMentionsMutationFn = Apollo.MutationFunction<types.RemoveSessionMentionsMutation, types.RemoveSessionMentionsMutationVariables>;

/**
 * __useRemoveSessionMentionsMutation__
 *
 * To run a mutation, you first call `useRemoveSessionMentionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSessionMentionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSessionMentionsMutation, { data, loading, error }] = useRemoveSessionMentionsMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scNames: // value for 'scNames'
 *   },
 * });
 */
export function useRemoveSessionMentionsMutation(baseOptions?: Apollo.MutationHookOptions<types.RemoveSessionMentionsMutation, types.RemoveSessionMentionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.RemoveSessionMentionsMutation, types.RemoveSessionMentionsMutationVariables>(RemoveSessionMentionsDocument, options);
      }
export type RemoveSessionMentionsMutationHookResult = ReturnType<typeof useRemoveSessionMentionsMutation>;
export type RemoveSessionMentionsMutationResult = Apollo.MutationResult<types.RemoveSessionMentionsMutation>;
export type RemoveSessionMentionsMutationOptions = Apollo.BaseMutationOptions<types.RemoveSessionMentionsMutation, types.RemoveSessionMentionsMutationVariables>;
export const RemoveSessionCrewDocument = gql`
    mutation removeSessionCrew($sessionId: ID!, $scNames: [String]!) {
  removeSessionCrew(sessionId: $sessionId, scNames: $scNames) {
    sessionId
    updatedAt
    mentionedUsers {
      scName
      captainId
    }
  }
}
    `;
export type RemoveSessionCrewMutationFn = Apollo.MutationFunction<types.RemoveSessionCrewMutation, types.RemoveSessionCrewMutationVariables>;

/**
 * __useRemoveSessionCrewMutation__
 *
 * To run a mutation, you first call `useRemoveSessionCrewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSessionCrewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSessionCrewMutation, { data, loading, error }] = useRemoveSessionCrewMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scNames: // value for 'scNames'
 *   },
 * });
 */
export function useRemoveSessionCrewMutation(baseOptions?: Apollo.MutationHookOptions<types.RemoveSessionCrewMutation, types.RemoveSessionCrewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.RemoveSessionCrewMutation, types.RemoveSessionCrewMutationVariables>(RemoveSessionCrewDocument, options);
      }
export type RemoveSessionCrewMutationHookResult = ReturnType<typeof useRemoveSessionCrewMutation>;
export type RemoveSessionCrewMutationResult = Apollo.MutationResult<types.RemoveSessionCrewMutation>;
export type RemoveSessionCrewMutationOptions = Apollo.BaseMutationOptions<types.RemoveSessionCrewMutation, types.RemoveSessionCrewMutationVariables>;
export const DeleteSessionDocument = gql`
    mutation deleteSession($sessionId: ID!) {
  deleteSession(sessionId: $sessionId)
}
    `;
export type DeleteSessionMutationFn = Apollo.MutationFunction<types.DeleteSessionMutation, types.DeleteSessionMutationVariables>;

/**
 * __useDeleteSessionMutation__
 *
 * To run a mutation, you first call `useDeleteSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSessionMutation, { data, loading, error }] = useDeleteSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useDeleteSessionMutation(baseOptions?: Apollo.MutationHookOptions<types.DeleteSessionMutation, types.DeleteSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeleteSessionMutation, types.DeleteSessionMutationVariables>(DeleteSessionDocument, options);
      }
export type DeleteSessionMutationHookResult = ReturnType<typeof useDeleteSessionMutation>;
export type DeleteSessionMutationResult = Apollo.MutationResult<types.DeleteSessionMutation>;
export type DeleteSessionMutationOptions = Apollo.BaseMutationOptions<types.DeleteSessionMutation, types.DeleteSessionMutationVariables>;
export const UpsertSessionUserDocument = gql`
    mutation upsertSessionUser($sessionId: ID!, $workSessionUser: SessionUserInput) {
  upsertSessionUser(sessionId: $sessionId, workSessionUser: $workSessionUser) {
    ...SessionUserFragment
  }
}
    ${SessionUserFragmentFragmentDoc}`;
export type UpsertSessionUserMutationFn = Apollo.MutationFunction<types.UpsertSessionUserMutation, types.UpsertSessionUserMutationVariables>;

/**
 * __useUpsertSessionUserMutation__
 *
 * To run a mutation, you first call `useUpsertSessionUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertSessionUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertSessionUserMutation, { data, loading, error }] = useUpsertSessionUserMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      workSessionUser: // value for 'workSessionUser'
 *   },
 * });
 */
export function useUpsertSessionUserMutation(baseOptions?: Apollo.MutationHookOptions<types.UpsertSessionUserMutation, types.UpsertSessionUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpsertSessionUserMutation, types.UpsertSessionUserMutationVariables>(UpsertSessionUserDocument, options);
      }
export type UpsertSessionUserMutationHookResult = ReturnType<typeof useUpsertSessionUserMutation>;
export type UpsertSessionUserMutationResult = Apollo.MutationResult<types.UpsertSessionUserMutation>;
export type UpsertSessionUserMutationOptions = Apollo.BaseMutationOptions<types.UpsertSessionUserMutation, types.UpsertSessionUserMutationVariables>;
export const UpdateSessionUserDocument = gql`
    mutation updateSessionUser($sessionId: ID!, $userId: ID!, $sessionUser: SessionUserUpdate!) {
  updateSessionUser(
    sessionId: $sessionId
    userId: $userId
    sessionUser: $sessionUser
  ) {
    ...SessionUserFragment
  }
}
    ${SessionUserFragmentFragmentDoc}`;
export type UpdateSessionUserMutationFn = Apollo.MutationFunction<types.UpdateSessionUserMutation, types.UpdateSessionUserMutationVariables>;

/**
 * __useUpdateSessionUserMutation__
 *
 * To run a mutation, you first call `useUpdateSessionUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSessionUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSessionUserMutation, { data, loading, error }] = useUpdateSessionUserMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      userId: // value for 'userId'
 *      sessionUser: // value for 'sessionUser'
 *   },
 * });
 */
export function useUpdateSessionUserMutation(baseOptions?: Apollo.MutationHookOptions<types.UpdateSessionUserMutation, types.UpdateSessionUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpdateSessionUserMutation, types.UpdateSessionUserMutationVariables>(UpdateSessionUserDocument, options);
      }
export type UpdateSessionUserMutationHookResult = ReturnType<typeof useUpdateSessionUserMutation>;
export type UpdateSessionUserMutationResult = Apollo.MutationResult<types.UpdateSessionUserMutation>;
export type UpdateSessionUserMutationOptions = Apollo.BaseMutationOptions<types.UpdateSessionUserMutation, types.UpdateSessionUserMutationVariables>;
export const UpdatePendingUsersDocument = gql`
    mutation updatePendingUsers($sessionId: ID!, $pendingUsers: [PendingUserInput!]!) {
  updatePendingUsers(sessionId: $sessionId, pendingUsers: $pendingUsers) {
    ...SessionFragment
  }
}
    ${SessionFragmentFragmentDoc}`;
export type UpdatePendingUsersMutationFn = Apollo.MutationFunction<types.UpdatePendingUsersMutation, types.UpdatePendingUsersMutationVariables>;

/**
 * __useUpdatePendingUsersMutation__
 *
 * To run a mutation, you first call `useUpdatePendingUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePendingUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePendingUsersMutation, { data, loading, error }] = useUpdatePendingUsersMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      pendingUsers: // value for 'pendingUsers'
 *   },
 * });
 */
export function useUpdatePendingUsersMutation(baseOptions?: Apollo.MutationHookOptions<types.UpdatePendingUsersMutation, types.UpdatePendingUsersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpdatePendingUsersMutation, types.UpdatePendingUsersMutationVariables>(UpdatePendingUsersDocument, options);
      }
export type UpdatePendingUsersMutationHookResult = ReturnType<typeof useUpdatePendingUsersMutation>;
export type UpdatePendingUsersMutationResult = Apollo.MutationResult<types.UpdatePendingUsersMutation>;
export type UpdatePendingUsersMutationOptions = Apollo.BaseMutationOptions<types.UpdatePendingUsersMutation, types.UpdatePendingUsersMutationVariables>;
export const JoinSessionDocument = gql`
    mutation joinSession($joinId: ID!) {
  joinSession(joinId: $joinId) {
    ...SessionUserFragment
  }
}
    ${SessionUserFragmentFragmentDoc}`;
export type JoinSessionMutationFn = Apollo.MutationFunction<types.JoinSessionMutation, types.JoinSessionMutationVariables>;

/**
 * __useJoinSessionMutation__
 *
 * To run a mutation, you first call `useJoinSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinSessionMutation, { data, loading, error }] = useJoinSessionMutation({
 *   variables: {
 *      joinId: // value for 'joinId'
 *   },
 * });
 */
export function useJoinSessionMutation(baseOptions?: Apollo.MutationHookOptions<types.JoinSessionMutation, types.JoinSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.JoinSessionMutation, types.JoinSessionMutationVariables>(JoinSessionDocument, options);
      }
export type JoinSessionMutationHookResult = ReturnType<typeof useJoinSessionMutation>;
export type JoinSessionMutationResult = Apollo.MutationResult<types.JoinSessionMutation>;
export type JoinSessionMutationOptions = Apollo.BaseMutationOptions<types.JoinSessionMutation, types.JoinSessionMutationVariables>;
export const LeaveSessionDocument = gql`
    mutation leaveSession($sessionId: ID!) {
  leaveSession(sessionId: $sessionId)
}
    `;
export type LeaveSessionMutationFn = Apollo.MutationFunction<types.LeaveSessionMutation, types.LeaveSessionMutationVariables>;

/**
 * __useLeaveSessionMutation__
 *
 * To run a mutation, you first call `useLeaveSessionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveSessionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveSessionMutation, { data, loading, error }] = useLeaveSessionMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useLeaveSessionMutation(baseOptions?: Apollo.MutationHookOptions<types.LeaveSessionMutation, types.LeaveSessionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.LeaveSessionMutation, types.LeaveSessionMutationVariables>(LeaveSessionDocument, options);
      }
export type LeaveSessionMutationHookResult = ReturnType<typeof useLeaveSessionMutation>;
export type LeaveSessionMutationResult = Apollo.MutationResult<types.LeaveSessionMutation>;
export type LeaveSessionMutationOptions = Apollo.BaseMutationOptions<types.LeaveSessionMutation, types.LeaveSessionMutationVariables>;
export const MarkCrewSharePaidDocument = gql`
    mutation markCrewSharePaid($sessionId: ID!, $orderId: ID!, $payeeScName: String!, $isPaid: Boolean!) {
  markCrewSharePaid(
    sessionId: $sessionId
    orderId: $orderId
    payeeScName: $payeeScName
    isPaid: $isPaid
  ) {
    ...CrewShareFragment
  }
}
    ${CrewShareFragmentFragmentDoc}`;
export type MarkCrewSharePaidMutationFn = Apollo.MutationFunction<types.MarkCrewSharePaidMutation, types.MarkCrewSharePaidMutationVariables>;

/**
 * __useMarkCrewSharePaidMutation__
 *
 * To run a mutation, you first call `useMarkCrewSharePaidMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkCrewSharePaidMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markCrewSharePaidMutation, { data, loading, error }] = useMarkCrewSharePaidMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *      payeeScName: // value for 'payeeScName'
 *      isPaid: // value for 'isPaid'
 *   },
 * });
 */
export function useMarkCrewSharePaidMutation(baseOptions?: Apollo.MutationHookOptions<types.MarkCrewSharePaidMutation, types.MarkCrewSharePaidMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.MarkCrewSharePaidMutation, types.MarkCrewSharePaidMutationVariables>(MarkCrewSharePaidDocument, options);
      }
export type MarkCrewSharePaidMutationHookResult = ReturnType<typeof useMarkCrewSharePaidMutation>;
export type MarkCrewSharePaidMutationResult = Apollo.MutationResult<types.MarkCrewSharePaidMutation>;
export type MarkCrewSharePaidMutationOptions = Apollo.BaseMutationOptions<types.MarkCrewSharePaidMutation, types.MarkCrewSharePaidMutationVariables>;
export const UpsertCrewShareDocument = gql`
    mutation upsertCrewShare($sessionId: ID!, $orderId: ID!, $crewShare: CrewShareInput!) {
  upsertCrewShare(sessionId: $sessionId, orderId: $orderId, crewShare: $crewShare) {
    ...CrewShareFragment
  }
}
    ${CrewShareFragmentFragmentDoc}`;
export type UpsertCrewShareMutationFn = Apollo.MutationFunction<types.UpsertCrewShareMutation, types.UpsertCrewShareMutationVariables>;

/**
 * __useUpsertCrewShareMutation__
 *
 * To run a mutation, you first call `useUpsertCrewShareMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertCrewShareMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertCrewShareMutation, { data, loading, error }] = useUpsertCrewShareMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *      crewShare: // value for 'crewShare'
 *   },
 * });
 */
export function useUpsertCrewShareMutation(baseOptions?: Apollo.MutationHookOptions<types.UpsertCrewShareMutation, types.UpsertCrewShareMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpsertCrewShareMutation, types.UpsertCrewShareMutationVariables>(UpsertCrewShareDocument, options);
      }
export type UpsertCrewShareMutationHookResult = ReturnType<typeof useUpsertCrewShareMutation>;
export type UpsertCrewShareMutationResult = Apollo.MutationResult<types.UpsertCrewShareMutation>;
export type UpsertCrewShareMutationOptions = Apollo.BaseMutationOptions<types.UpsertCrewShareMutation, types.UpsertCrewShareMutationVariables>;
export const DeleteCrewShareDocument = gql`
    mutation deleteCrewShare($sessionId: ID!, $orderId: ID!, $payeeScName: String!) {
  deleteCrewShare(
    sessionId: $sessionId
    orderId: $orderId
    payeeScName: $payeeScName
  ) {
    sessionId
    orderId
    payeeScName
    payeeUserId
  }
}
    `;
export type DeleteCrewShareMutationFn = Apollo.MutationFunction<types.DeleteCrewShareMutation, types.DeleteCrewShareMutationVariables>;

/**
 * __useDeleteCrewShareMutation__
 *
 * To run a mutation, you first call `useDeleteCrewShareMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCrewShareMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCrewShareMutation, { data, loading, error }] = useDeleteCrewShareMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *      payeeScName: // value for 'payeeScName'
 *   },
 * });
 */
export function useDeleteCrewShareMutation(baseOptions?: Apollo.MutationHookOptions<types.DeleteCrewShareMutation, types.DeleteCrewShareMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeleteCrewShareMutation, types.DeleteCrewShareMutationVariables>(DeleteCrewShareDocument, options);
      }
export type DeleteCrewShareMutationHookResult = ReturnType<typeof useDeleteCrewShareMutation>;
export type DeleteCrewShareMutationResult = Apollo.MutationResult<types.DeleteCrewShareMutation>;
export type DeleteCrewShareMutationOptions = Apollo.BaseMutationOptions<types.DeleteCrewShareMutation, types.DeleteCrewShareMutationVariables>;
export const AddScoutingFindDocument = gql`
    mutation addScoutingFind($sessionId: ID!, $scoutingFind: ScoutingFindInput!, $shipRocks: [ShipRockInput!], $vehicleRocks: [VehicleRockInput!], $wrecks: [SalvageWreckInput!]) {
  addScoutingFind(
    sessionId: $sessionId
    scoutingFind: $scoutingFind
    shipRocks: $shipRocks
    vehicleRocks: $vehicleRocks
    wrecks: $wrecks
  ) {
    ...ScoutingFindFragment
  }
}
    ${ScoutingFindFragmentFragmentDoc}`;
export type AddScoutingFindMutationFn = Apollo.MutationFunction<types.AddScoutingFindMutation, types.AddScoutingFindMutationVariables>;

/**
 * __useAddScoutingFindMutation__
 *
 * To run a mutation, you first call `useAddScoutingFindMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddScoutingFindMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addScoutingFindMutation, { data, loading, error }] = useAddScoutingFindMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scoutingFind: // value for 'scoutingFind'
 *      shipRocks: // value for 'shipRocks'
 *      vehicleRocks: // value for 'vehicleRocks'
 *      wrecks: // value for 'wrecks'
 *   },
 * });
 */
export function useAddScoutingFindMutation(baseOptions?: Apollo.MutationHookOptions<types.AddScoutingFindMutation, types.AddScoutingFindMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.AddScoutingFindMutation, types.AddScoutingFindMutationVariables>(AddScoutingFindDocument, options);
      }
export type AddScoutingFindMutationHookResult = ReturnType<typeof useAddScoutingFindMutation>;
export type AddScoutingFindMutationResult = Apollo.MutationResult<types.AddScoutingFindMutation>;
export type AddScoutingFindMutationOptions = Apollo.BaseMutationOptions<types.AddScoutingFindMutation, types.AddScoutingFindMutationVariables>;
export const UpdateScoutingFindDocument = gql`
    mutation updateScoutingFind($sessionId: ID!, $scoutingFindId: ID!, $scoutingFind: ScoutingFindInput!, $shipRocks: [ShipRockInput!], $vehicleRocks: [VehicleRockInput!], $wrecks: [SalvageWreckInput!]) {
  updateScoutingFind(
    sessionId: $sessionId
    scoutingFindId: $scoutingFindId
    scoutingFind: $scoutingFind
    shipRocks: $shipRocks
    vehicleRocks: $vehicleRocks
    wrecks: $wrecks
  ) {
    ...ScoutingFindFragment
  }
}
    ${ScoutingFindFragmentFragmentDoc}`;
export type UpdateScoutingFindMutationFn = Apollo.MutationFunction<types.UpdateScoutingFindMutation, types.UpdateScoutingFindMutationVariables>;

/**
 * __useUpdateScoutingFindMutation__
 *
 * To run a mutation, you first call `useUpdateScoutingFindMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateScoutingFindMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateScoutingFindMutation, { data, loading, error }] = useUpdateScoutingFindMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scoutingFindId: // value for 'scoutingFindId'
 *      scoutingFind: // value for 'scoutingFind'
 *      shipRocks: // value for 'shipRocks'
 *      vehicleRocks: // value for 'vehicleRocks'
 *      wrecks: // value for 'wrecks'
 *   },
 * });
 */
export function useUpdateScoutingFindMutation(baseOptions?: Apollo.MutationHookOptions<types.UpdateScoutingFindMutation, types.UpdateScoutingFindMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpdateScoutingFindMutation, types.UpdateScoutingFindMutationVariables>(UpdateScoutingFindDocument, options);
      }
export type UpdateScoutingFindMutationHookResult = ReturnType<typeof useUpdateScoutingFindMutation>;
export type UpdateScoutingFindMutationResult = Apollo.MutationResult<types.UpdateScoutingFindMutation>;
export type UpdateScoutingFindMutationOptions = Apollo.BaseMutationOptions<types.UpdateScoutingFindMutation, types.UpdateScoutingFindMutationVariables>;
export const DeleteScoutingFindDocument = gql`
    mutation deleteScoutingFind($sessionId: ID!, $scoutingFindId: ID!) {
  deleteScoutingFind(sessionId: $sessionId, scoutingFindId: $scoutingFindId) {
    ... on ScoutingFindInterface {
      sessionId
      scoutingFindId
    }
  }
}
    `;
export type DeleteScoutingFindMutationFn = Apollo.MutationFunction<types.DeleteScoutingFindMutation, types.DeleteScoutingFindMutationVariables>;

/**
 * __useDeleteScoutingFindMutation__
 *
 * To run a mutation, you first call `useDeleteScoutingFindMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScoutingFindMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScoutingFindMutation, { data, loading, error }] = useDeleteScoutingFindMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scoutingFindId: // value for 'scoutingFindId'
 *   },
 * });
 */
export function useDeleteScoutingFindMutation(baseOptions?: Apollo.MutationHookOptions<types.DeleteScoutingFindMutation, types.DeleteScoutingFindMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeleteScoutingFindMutation, types.DeleteScoutingFindMutationVariables>(DeleteScoutingFindDocument, options);
      }
export type DeleteScoutingFindMutationHookResult = ReturnType<typeof useDeleteScoutingFindMutation>;
export type DeleteScoutingFindMutationResult = Apollo.MutationResult<types.DeleteScoutingFindMutation>;
export type DeleteScoutingFindMutationOptions = Apollo.BaseMutationOptions<types.DeleteScoutingFindMutation, types.DeleteScoutingFindMutationVariables>;
export const JoinScoutingFindDocument = gql`
    mutation joinScoutingFind($sessionId: ID!, $scoutingFindId: ID!, $enRoute: Boolean) {
  joinScoutingFind(
    sessionId: $sessionId
    scoutingFindId: $scoutingFindId
    enRoute: $enRoute
  ) {
    ...ScoutingIdFragment
  }
}
    ${ScoutingIdFragmentFragmentDoc}`;
export type JoinScoutingFindMutationFn = Apollo.MutationFunction<types.JoinScoutingFindMutation, types.JoinScoutingFindMutationVariables>;

/**
 * __useJoinScoutingFindMutation__
 *
 * To run a mutation, you first call `useJoinScoutingFindMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinScoutingFindMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinScoutingFindMutation, { data, loading, error }] = useJoinScoutingFindMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scoutingFindId: // value for 'scoutingFindId'
 *      enRoute: // value for 'enRoute'
 *   },
 * });
 */
export function useJoinScoutingFindMutation(baseOptions?: Apollo.MutationHookOptions<types.JoinScoutingFindMutation, types.JoinScoutingFindMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.JoinScoutingFindMutation, types.JoinScoutingFindMutationVariables>(JoinScoutingFindDocument, options);
      }
export type JoinScoutingFindMutationHookResult = ReturnType<typeof useJoinScoutingFindMutation>;
export type JoinScoutingFindMutationResult = Apollo.MutationResult<types.JoinScoutingFindMutation>;
export type JoinScoutingFindMutationOptions = Apollo.BaseMutationOptions<types.JoinScoutingFindMutation, types.JoinScoutingFindMutationVariables>;
export const LeaveScoutingFindDocument = gql`
    mutation leaveScoutingFind($sessionId: ID!, $scoutingFindId: ID!) {
  leaveScoutingFind(sessionId: $sessionId, scoutingFindId: $scoutingFindId) {
    ...ScoutingIdFragment
  }
}
    ${ScoutingIdFragmentFragmentDoc}`;
export type LeaveScoutingFindMutationFn = Apollo.MutationFunction<types.LeaveScoutingFindMutation, types.LeaveScoutingFindMutationVariables>;

/**
 * __useLeaveScoutingFindMutation__
 *
 * To run a mutation, you first call `useLeaveScoutingFindMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveScoutingFindMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveScoutingFindMutation, { data, loading, error }] = useLeaveScoutingFindMutation({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      scoutingFindId: // value for 'scoutingFindId'
 *   },
 * });
 */
export function useLeaveScoutingFindMutation(baseOptions?: Apollo.MutationHookOptions<types.LeaveScoutingFindMutation, types.LeaveScoutingFindMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.LeaveScoutingFindMutation, types.LeaveScoutingFindMutationVariables>(LeaveScoutingFindDocument, options);
      }
export type LeaveScoutingFindMutationHookResult = ReturnType<typeof useLeaveScoutingFindMutation>;
export type LeaveScoutingFindMutationResult = Apollo.MutationResult<types.LeaveScoutingFindMutation>;
export type LeaveScoutingFindMutationOptions = Apollo.BaseMutationOptions<types.LeaveScoutingFindMutation, types.LeaveScoutingFindMutationVariables>;
export const CreateLoadoutDocument = gql`
    mutation createLoadout($miningLoadout: MiningLoadoutInput!) {
  createLoadout(shipLoadout: $miningLoadout) {
    ...MiningLoadoutFragment
  }
}
    ${MiningLoadoutFragmentFragmentDoc}`;
export type CreateLoadoutMutationFn = Apollo.MutationFunction<types.CreateLoadoutMutation, types.CreateLoadoutMutationVariables>;

/**
 * __useCreateLoadoutMutation__
 *
 * To run a mutation, you first call `useCreateLoadoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLoadoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLoadoutMutation, { data, loading, error }] = useCreateLoadoutMutation({
 *   variables: {
 *      miningLoadout: // value for 'miningLoadout'
 *   },
 * });
 */
export function useCreateLoadoutMutation(baseOptions?: Apollo.MutationHookOptions<types.CreateLoadoutMutation, types.CreateLoadoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.CreateLoadoutMutation, types.CreateLoadoutMutationVariables>(CreateLoadoutDocument, options);
      }
export type CreateLoadoutMutationHookResult = ReturnType<typeof useCreateLoadoutMutation>;
export type CreateLoadoutMutationResult = Apollo.MutationResult<types.CreateLoadoutMutation>;
export type CreateLoadoutMutationOptions = Apollo.BaseMutationOptions<types.CreateLoadoutMutation, types.CreateLoadoutMutationVariables>;
export const UpdateLoadoutDocument = gql`
    mutation updateLoadout($loadoutId: String!, $shipLoadout: MiningLoadoutInput!) {
  updateLoadout(loadoutId: $loadoutId, shipLoadout: $shipLoadout) {
    ...MiningLoadoutFragment
  }
}
    ${MiningLoadoutFragmentFragmentDoc}`;
export type UpdateLoadoutMutationFn = Apollo.MutationFunction<types.UpdateLoadoutMutation, types.UpdateLoadoutMutationVariables>;

/**
 * __useUpdateLoadoutMutation__
 *
 * To run a mutation, you first call `useUpdateLoadoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLoadoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLoadoutMutation, { data, loading, error }] = useUpdateLoadoutMutation({
 *   variables: {
 *      loadoutId: // value for 'loadoutId'
 *      shipLoadout: // value for 'shipLoadout'
 *   },
 * });
 */
export function useUpdateLoadoutMutation(baseOptions?: Apollo.MutationHookOptions<types.UpdateLoadoutMutation, types.UpdateLoadoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.UpdateLoadoutMutation, types.UpdateLoadoutMutationVariables>(UpdateLoadoutDocument, options);
      }
export type UpdateLoadoutMutationHookResult = ReturnType<typeof useUpdateLoadoutMutation>;
export type UpdateLoadoutMutationResult = Apollo.MutationResult<types.UpdateLoadoutMutation>;
export type UpdateLoadoutMutationOptions = Apollo.BaseMutationOptions<types.UpdateLoadoutMutation, types.UpdateLoadoutMutationVariables>;
export const DeleteLoadoutDocument = gql`
    mutation deleteLoadout($loadoutId: String!) {
  deleteLoadout(loadoutId: $loadoutId) {
    loadoutId
  }
}
    `;
export type DeleteLoadoutMutationFn = Apollo.MutationFunction<types.DeleteLoadoutMutation, types.DeleteLoadoutMutationVariables>;

/**
 * __useDeleteLoadoutMutation__
 *
 * To run a mutation, you first call `useDeleteLoadoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLoadoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLoadoutMutation, { data, loading, error }] = useDeleteLoadoutMutation({
 *   variables: {
 *      loadoutId: // value for 'loadoutId'
 *   },
 * });
 */
export function useDeleteLoadoutMutation(baseOptions?: Apollo.MutationHookOptions<types.DeleteLoadoutMutation, types.DeleteLoadoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<types.DeleteLoadoutMutation, types.DeleteLoadoutMutationVariables>(DeleteLoadoutDocument, options);
      }
export type DeleteLoadoutMutationHookResult = ReturnType<typeof useDeleteLoadoutMutation>;
export type DeleteLoadoutMutationResult = Apollo.MutationResult<types.DeleteLoadoutMutation>;
export type DeleteLoadoutMutationOptions = Apollo.BaseMutationOptions<types.DeleteLoadoutMutation, types.DeleteLoadoutMutationVariables>;
export const GetUserProfileDocument = gql`
    query getUserProfile {
  profile {
    ...UserProfileFragment
  }
}
    ${UserProfileFragmentFragmentDoc}`;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserProfileQuery(baseOptions?: Apollo.QueryHookOptions<types.GetUserProfileQuery, types.GetUserProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetUserProfileQuery, types.GetUserProfileQueryVariables>(GetUserProfileDocument, options);
      }
export function useGetUserProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetUserProfileQuery, types.GetUserProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetUserProfileQuery, types.GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export function useGetUserProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetUserProfileQuery, types.GetUserProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetUserProfileQuery, types.GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
export type GetUserProfileSuspenseQueryHookResult = ReturnType<typeof useGetUserProfileSuspenseQuery>;
export type GetUserProfileQueryResult = Apollo.QueryResult<types.GetUserProfileQuery, types.GetUserProfileQueryVariables>;
export const GetLoadoutsDocument = gql`
    query getLoadouts {
  profile {
    ...UserProfileLoadoutFragment
  }
}
    ${UserProfileLoadoutFragmentFragmentDoc}`;

/**
 * __useGetLoadoutsQuery__
 *
 * To run a query within a React component, call `useGetLoadoutsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoadoutsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoadoutsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLoadoutsQuery(baseOptions?: Apollo.QueryHookOptions<types.GetLoadoutsQuery, types.GetLoadoutsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetLoadoutsQuery, types.GetLoadoutsQueryVariables>(GetLoadoutsDocument, options);
      }
export function useGetLoadoutsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetLoadoutsQuery, types.GetLoadoutsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetLoadoutsQuery, types.GetLoadoutsQueryVariables>(GetLoadoutsDocument, options);
        }
export function useGetLoadoutsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetLoadoutsQuery, types.GetLoadoutsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetLoadoutsQuery, types.GetLoadoutsQueryVariables>(GetLoadoutsDocument, options);
        }
export type GetLoadoutsQueryHookResult = ReturnType<typeof useGetLoadoutsQuery>;
export type GetLoadoutsLazyQueryHookResult = ReturnType<typeof useGetLoadoutsLazyQuery>;
export type GetLoadoutsSuspenseQueryHookResult = ReturnType<typeof useGetLoadoutsSuspenseQuery>;
export type GetLoadoutsQueryResult = Apollo.QueryResult<types.GetLoadoutsQuery, types.GetLoadoutsQueryVariables>;
export const GetSessionUserDocument = gql`
    query getSessionUser($sessionId: ID!) {
  sessionUser(sessionId: $sessionId) {
    ...SessionUserFragment
  }
}
    ${SessionUserFragmentFragmentDoc}`;

/**
 * __useGetSessionUserQuery__
 *
 * To run a query within a React component, call `useGetSessionUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionUserQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useGetSessionUserQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionUserQuery, types.GetSessionUserQueryVariables> & ({ variables: types.GetSessionUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>(GetSessionUserDocument, options);
      }
export function useGetSessionUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>(GetSessionUserDocument, options);
        }
export function useGetSessionUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>(GetSessionUserDocument, options);
        }
export type GetSessionUserQueryHookResult = ReturnType<typeof useGetSessionUserQuery>;
export type GetSessionUserLazyQueryHookResult = ReturnType<typeof useGetSessionUserLazyQuery>;
export type GetSessionUserSuspenseQueryHookResult = ReturnType<typeof useGetSessionUserSuspenseQuery>;
export type GetSessionUserQueryResult = Apollo.QueryResult<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>;
export const GetMyUserSessionsDocument = gql`
    query getMyUserSessions($nextToken: String) {
  profile {
    userId
    mySessions(nextToken: $nextToken) {
      items {
        ...SessionFragment
      }
      nextToken
    }
  }
}
    ${SessionFragmentFragmentDoc}`;

/**
 * __useGetMyUserSessionsQuery__
 *
 * To run a query within a React component, call `useGetMyUserSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyUserSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyUserSessionsQuery({
 *   variables: {
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useGetMyUserSessionsQuery(baseOptions?: Apollo.QueryHookOptions<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>(GetMyUserSessionsDocument, options);
      }
export function useGetMyUserSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>(GetMyUserSessionsDocument, options);
        }
export function useGetMyUserSessionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>(GetMyUserSessionsDocument, options);
        }
export type GetMyUserSessionsQueryHookResult = ReturnType<typeof useGetMyUserSessionsQuery>;
export type GetMyUserSessionsLazyQueryHookResult = ReturnType<typeof useGetMyUserSessionsLazyQuery>;
export type GetMyUserSessionsSuspenseQueryHookResult = ReturnType<typeof useGetMyUserSessionsSuspenseQuery>;
export type GetMyUserSessionsQueryResult = Apollo.QueryResult<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>;
export const GetJoinedUserSessionsDocument = gql`
    query getJoinedUserSessions($nextToken: String) {
  profile {
    userId
    joinedSessions(nextToken: $nextToken) {
      items {
        ...SessionFragment
      }
      nextToken
    }
  }
}
    ${SessionFragmentFragmentDoc}`;

/**
 * __useGetJoinedUserSessionsQuery__
 *
 * To run a query within a React component, call `useGetJoinedUserSessionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJoinedUserSessionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJoinedUserSessionsQuery({
 *   variables: {
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useGetJoinedUserSessionsQuery(baseOptions?: Apollo.QueryHookOptions<types.GetJoinedUserSessionsQuery, types.GetJoinedUserSessionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetJoinedUserSessionsQuery, types.GetJoinedUserSessionsQueryVariables>(GetJoinedUserSessionsDocument, options);
      }
export function useGetJoinedUserSessionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetJoinedUserSessionsQuery, types.GetJoinedUserSessionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetJoinedUserSessionsQuery, types.GetJoinedUserSessionsQueryVariables>(GetJoinedUserSessionsDocument, options);
        }
export function useGetJoinedUserSessionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetJoinedUserSessionsQuery, types.GetJoinedUserSessionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetJoinedUserSessionsQuery, types.GetJoinedUserSessionsQueryVariables>(GetJoinedUserSessionsDocument, options);
        }
export type GetJoinedUserSessionsQueryHookResult = ReturnType<typeof useGetJoinedUserSessionsQuery>;
export type GetJoinedUserSessionsLazyQueryHookResult = ReturnType<typeof useGetJoinedUserSessionsLazyQuery>;
export type GetJoinedUserSessionsSuspenseQueryHookResult = ReturnType<typeof useGetJoinedUserSessionsSuspenseQuery>;
export type GetJoinedUserSessionsQueryResult = Apollo.QueryResult<types.GetJoinedUserSessionsQuery, types.GetJoinedUserSessionsQueryVariables>;
export const GetUserDocument = gql`
    query getUser($userId: ID!) {
  user(userId: $userId) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<types.GetUserQuery, types.GetUserQueryVariables> & ({ variables: types.GetUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetUserQuery, types.GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetUserQuery, types.GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetUserQuery, types.GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetUserQuery, types.GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetUserQuery, types.GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<types.GetUserQuery, types.GetUserQueryVariables>;
export const GetSessionDocument = gql`
    query getSession($sessionId: ID!) {
  session(sessionId: $sessionId) {
    ...SessionFragment
  }
}
    ${SessionFragmentFragmentDoc}`;

/**
 * __useGetSessionQuery__
 *
 * To run a query within a React component, call `useGetSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useGetSessionQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionQuery, types.GetSessionQueryVariables> & ({ variables: types.GetSessionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionQuery, types.GetSessionQueryVariables>(GetSessionDocument, options);
      }
export function useGetSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionQuery, types.GetSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionQuery, types.GetSessionQueryVariables>(GetSessionDocument, options);
        }
export function useGetSessionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionQuery, types.GetSessionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionQuery, types.GetSessionQueryVariables>(GetSessionDocument, options);
        }
export type GetSessionQueryHookResult = ReturnType<typeof useGetSessionQuery>;
export type GetSessionLazyQueryHookResult = ReturnType<typeof useGetSessionLazyQuery>;
export type GetSessionSuspenseQueryHookResult = ReturnType<typeof useGetSessionSuspenseQuery>;
export type GetSessionQueryResult = Apollo.QueryResult<types.GetSessionQuery, types.GetSessionQueryVariables>;
export const GetSessionUpdatesDocument = gql`
    query getSessionUpdates($sessionId: ID!, $lastCheck: String!) {
  sessionUpdates(sessionId: $sessionId, lastCheck: $lastCheck) {
    sessionId
    eventName
    eventDate
    data {
      ... on WorkOrderInterface {
        ...WorkOrderBaseFragment
        workOrderState: state
      }
      ... on ScoutingFindInterface {
        ...ScoutingFindBaseFragment
        attendance {
          ...SessionUserFragment
        }
        scoutingState: state
      }
      ... on CrewShare {
        ...CrewShareBaseFragment
        crewShareState: state
      }
      ... on SessionUser {
        ...SessionUserBaseFragment
        sessionUserState: state
      }
      ... on Session {
        ...SessionBaseFragment
        sessionState: state
      }
      __typename
    }
  }
}
    ${WorkOrderBaseFragmentFragmentDoc}
${ScoutingFindBaseFragmentFragmentDoc}
${SessionUserFragmentFragmentDoc}
${CrewShareBaseFragmentFragmentDoc}
${SessionUserBaseFragmentFragmentDoc}
${SessionBaseFragmentFragmentDoc}`;

/**
 * __useGetSessionUpdatesQuery__
 *
 * To run a query within a React component, call `useGetSessionUpdatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionUpdatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionUpdatesQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      lastCheck: // value for 'lastCheck'
 *   },
 * });
 */
export function useGetSessionUpdatesQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionUpdatesQuery, types.GetSessionUpdatesQueryVariables> & ({ variables: types.GetSessionUpdatesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionUpdatesQuery, types.GetSessionUpdatesQueryVariables>(GetSessionUpdatesDocument, options);
      }
export function useGetSessionUpdatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionUpdatesQuery, types.GetSessionUpdatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionUpdatesQuery, types.GetSessionUpdatesQueryVariables>(GetSessionUpdatesDocument, options);
        }
export function useGetSessionUpdatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionUpdatesQuery, types.GetSessionUpdatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionUpdatesQuery, types.GetSessionUpdatesQueryVariables>(GetSessionUpdatesDocument, options);
        }
export type GetSessionUpdatesQueryHookResult = ReturnType<typeof useGetSessionUpdatesQuery>;
export type GetSessionUpdatesLazyQueryHookResult = ReturnType<typeof useGetSessionUpdatesLazyQuery>;
export type GetSessionUpdatesSuspenseQueryHookResult = ReturnType<typeof useGetSessionUpdatesSuspenseQuery>;
export type GetSessionUpdatesQueryResult = Apollo.QueryResult<types.GetSessionUpdatesQuery, types.GetSessionUpdatesQueryVariables>;
export const GetSessionShareDocument = gql`
    query getSessionShare($joinId: ID!) {
  sessionShare(joinId: $joinId) {
    ...SessionShareFragment
  }
}
    ${SessionShareFragmentFragmentDoc}`;

/**
 * __useGetSessionShareQuery__
 *
 * To run a query within a React component, call `useGetSessionShareQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionShareQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionShareQuery({
 *   variables: {
 *      joinId: // value for 'joinId'
 *   },
 * });
 */
export function useGetSessionShareQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionShareQuery, types.GetSessionShareQueryVariables> & ({ variables: types.GetSessionShareQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionShareQuery, types.GetSessionShareQueryVariables>(GetSessionShareDocument, options);
      }
export function useGetSessionShareLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionShareQuery, types.GetSessionShareQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionShareQuery, types.GetSessionShareQueryVariables>(GetSessionShareDocument, options);
        }
export function useGetSessionShareSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionShareQuery, types.GetSessionShareQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionShareQuery, types.GetSessionShareQueryVariables>(GetSessionShareDocument, options);
        }
export type GetSessionShareQueryHookResult = ReturnType<typeof useGetSessionShareQuery>;
export type GetSessionShareLazyQueryHookResult = ReturnType<typeof useGetSessionShareLazyQuery>;
export type GetSessionShareSuspenseQueryHookResult = ReturnType<typeof useGetSessionShareSuspenseQuery>;
export type GetSessionShareQueryResult = Apollo.QueryResult<types.GetSessionShareQuery, types.GetSessionShareQueryVariables>;
export const GetSessionStubDocument = gql`
    query getSessionStub($sessionId: ID!) {
  session(sessionId: $sessionId) {
    ...SessionListFragment
  }
}
    ${SessionListFragmentFragmentDoc}`;

/**
 * __useGetSessionStubQuery__
 *
 * To run a query within a React component, call `useGetSessionStubQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionStubQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionStubQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useGetSessionStubQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionStubQuery, types.GetSessionStubQueryVariables> & ({ variables: types.GetSessionStubQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>(GetSessionStubDocument, options);
      }
export function useGetSessionStubLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>(GetSessionStubDocument, options);
        }
export function useGetSessionStubSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>(GetSessionStubDocument, options);
        }
export type GetSessionStubQueryHookResult = ReturnType<typeof useGetSessionStubQuery>;
export type GetSessionStubLazyQueryHookResult = ReturnType<typeof useGetSessionStubLazyQuery>;
export type GetSessionStubSuspenseQueryHookResult = ReturnType<typeof useGetSessionStubSuspenseQuery>;
export type GetSessionStubQueryResult = Apollo.QueryResult<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>;
export const GetSessionScoutingDocument = gql`
    query getSessionScouting($sessionId: ID!, $nextToken: String) {
  session(sessionId: $sessionId) {
    ...SessionScoutingFragment
  }
}
    ${SessionScoutingFragmentFragmentDoc}`;

/**
 * __useGetSessionScoutingQuery__
 *
 * To run a query within a React component, call `useGetSessionScoutingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionScoutingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionScoutingQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useGetSessionScoutingQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables> & ({ variables: types.GetSessionScoutingQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>(GetSessionScoutingDocument, options);
      }
export function useGetSessionScoutingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>(GetSessionScoutingDocument, options);
        }
export function useGetSessionScoutingSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>(GetSessionScoutingDocument, options);
        }
export type GetSessionScoutingQueryHookResult = ReturnType<typeof useGetSessionScoutingQuery>;
export type GetSessionScoutingLazyQueryHookResult = ReturnType<typeof useGetSessionScoutingLazyQuery>;
export type GetSessionScoutingSuspenseQueryHookResult = ReturnType<typeof useGetSessionScoutingSuspenseQuery>;
export type GetSessionScoutingQueryResult = Apollo.QueryResult<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>;
export const GetSessionActiveMembersDocument = gql`
    query getSessionActiveMembers($sessionId: ID!, $nextToken: String) {
  session(sessionId: $sessionId) {
    ...SessionActiveMembersFragment
  }
}
    ${SessionActiveMembersFragmentFragmentDoc}`;

/**
 * __useGetSessionActiveMembersQuery__
 *
 * To run a query within a React component, call `useGetSessionActiveMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionActiveMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionActiveMembersQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useGetSessionActiveMembersQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables> & ({ variables: types.GetSessionActiveMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>(GetSessionActiveMembersDocument, options);
      }
export function useGetSessionActiveMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>(GetSessionActiveMembersDocument, options);
        }
export function useGetSessionActiveMembersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>(GetSessionActiveMembersDocument, options);
        }
export type GetSessionActiveMembersQueryHookResult = ReturnType<typeof useGetSessionActiveMembersQuery>;
export type GetSessionActiveMembersLazyQueryHookResult = ReturnType<typeof useGetSessionActiveMembersLazyQuery>;
export type GetSessionActiveMembersSuspenseQueryHookResult = ReturnType<typeof useGetSessionActiveMembersSuspenseQuery>;
export type GetSessionActiveMembersQueryResult = Apollo.QueryResult<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>;
export const GetSessionWorkOrdersDocument = gql`
    query getSessionWorkOrders($sessionId: ID!, $nextToken: String) {
  session(sessionId: $sessionId) {
    ...SessionWorkOrdersFragment
  }
}
    ${SessionWorkOrdersFragmentFragmentDoc}`;

/**
 * __useGetSessionWorkOrdersQuery__
 *
 * To run a query within a React component, call `useGetSessionWorkOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionWorkOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionWorkOrdersQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useGetSessionWorkOrdersQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables> & ({ variables: types.GetSessionWorkOrdersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>(GetSessionWorkOrdersDocument, options);
      }
export function useGetSessionWorkOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>(GetSessionWorkOrdersDocument, options);
        }
export function useGetSessionWorkOrdersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>(GetSessionWorkOrdersDocument, options);
        }
export type GetSessionWorkOrdersQueryHookResult = ReturnType<typeof useGetSessionWorkOrdersQuery>;
export type GetSessionWorkOrdersLazyQueryHookResult = ReturnType<typeof useGetSessionWorkOrdersLazyQuery>;
export type GetSessionWorkOrdersSuspenseQueryHookResult = ReturnType<typeof useGetSessionWorkOrdersSuspenseQuery>;
export type GetSessionWorkOrdersQueryResult = Apollo.QueryResult<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>;
export const GetWorkOrderDocument = gql`
    query getWorkOrder($orderId: ID!, $sessionId: ID!) {
  workOrder(sessionId: $sessionId, orderId: $orderId) {
    ...WorkOrderFragment
  }
}
    ${WorkOrderFragmentFragmentDoc}`;

/**
 * __useGetWorkOrderQuery__
 *
 * To run a query within a React component, call `useGetWorkOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkOrderQuery({
 *   variables: {
 *      orderId: // value for 'orderId'
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useGetWorkOrderQuery(baseOptions: Apollo.QueryHookOptions<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables> & ({ variables: types.GetWorkOrderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>(GetWorkOrderDocument, options);
      }
export function useGetWorkOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>(GetWorkOrderDocument, options);
        }
export function useGetWorkOrderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>(GetWorkOrderDocument, options);
        }
export type GetWorkOrderQueryHookResult = ReturnType<typeof useGetWorkOrderQuery>;
export type GetWorkOrderLazyQueryHookResult = ReturnType<typeof useGetWorkOrderLazyQuery>;
export type GetWorkOrderSuspenseQueryHookResult = ReturnType<typeof useGetWorkOrderSuspenseQuery>;
export type GetWorkOrderQueryResult = Apollo.QueryResult<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>;
export const GetScoutingFindDocument = gql`
    query getScoutingFind($scoutingFindId: ID!, $sessionId: ID!) {
  scoutingFind(sessionId: $sessionId, scoutingFindId: $scoutingFindId) {
    ...ScoutingFindFragment
  }
}
    ${ScoutingFindFragmentFragmentDoc}`;

/**
 * __useGetScoutingFindQuery__
 *
 * To run a query within a React component, call `useGetScoutingFindQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScoutingFindQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScoutingFindQuery({
 *   variables: {
 *      scoutingFindId: // value for 'scoutingFindId'
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useGetScoutingFindQuery(baseOptions: Apollo.QueryHookOptions<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables> & ({ variables: types.GetScoutingFindQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>(GetScoutingFindDocument, options);
      }
export function useGetScoutingFindLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>(GetScoutingFindDocument, options);
        }
export function useGetScoutingFindSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>(GetScoutingFindDocument, options);
        }
export type GetScoutingFindQueryHookResult = ReturnType<typeof useGetScoutingFindQuery>;
export type GetScoutingFindLazyQueryHookResult = ReturnType<typeof useGetScoutingFindLazyQuery>;
export type GetScoutingFindSuspenseQueryHookResult = ReturnType<typeof useGetScoutingFindSuspenseQuery>;
export type GetScoutingFindQueryResult = Apollo.QueryResult<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>;
export const GetCrewSharesDocument = gql`
    query getCrewShares($sessionId: ID!, $orderId: ID, $nextToken: String) {
  crewShares(sessionId: $sessionId, orderId: $orderId, nextToken: $nextToken) {
    items {
      ...CrewShareFragment
    }
    nextToken
  }
}
    ${CrewShareFragmentFragmentDoc}`;

/**
 * __useGetCrewSharesQuery__
 *
 * To run a query within a React component, call `useGetCrewSharesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCrewSharesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCrewSharesQuery({
 *   variables: {
 *      sessionId: // value for 'sessionId'
 *      orderId: // value for 'orderId'
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useGetCrewSharesQuery(baseOptions: Apollo.QueryHookOptions<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables> & ({ variables: types.GetCrewSharesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>(GetCrewSharesDocument, options);
      }
export function useGetCrewSharesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>(GetCrewSharesDocument, options);
        }
export function useGetCrewSharesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>(GetCrewSharesDocument, options);
        }
export type GetCrewSharesQueryHookResult = ReturnType<typeof useGetCrewSharesQuery>;
export type GetCrewSharesLazyQueryHookResult = ReturnType<typeof useGetCrewSharesLazyQuery>;
export type GetCrewSharesSuspenseQueryHookResult = ReturnType<typeof useGetCrewSharesSuspenseQuery>;
export type GetCrewSharesQueryResult = Apollo.QueryResult<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>;
export const CaptureShipRockScanDocument = gql`
    query captureShipRockScan($imgUrl: String!) {
  captureShipRockScan(imgUrl: $imgUrl) {
    mass
    inst
    res
    ores {
      ore
      percent
    }
  }
}
    `;

/**
 * __useCaptureShipRockScanQuery__
 *
 * To run a query within a React component, call `useCaptureShipRockScanQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaptureShipRockScanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaptureShipRockScanQuery({
 *   variables: {
 *      imgUrl: // value for 'imgUrl'
 *   },
 * });
 */
export function useCaptureShipRockScanQuery(baseOptions: Apollo.QueryHookOptions<types.CaptureShipRockScanQuery, types.CaptureShipRockScanQueryVariables> & ({ variables: types.CaptureShipRockScanQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.CaptureShipRockScanQuery, types.CaptureShipRockScanQueryVariables>(CaptureShipRockScanDocument, options);
      }
export function useCaptureShipRockScanLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.CaptureShipRockScanQuery, types.CaptureShipRockScanQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.CaptureShipRockScanQuery, types.CaptureShipRockScanQueryVariables>(CaptureShipRockScanDocument, options);
        }
export function useCaptureShipRockScanSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.CaptureShipRockScanQuery, types.CaptureShipRockScanQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.CaptureShipRockScanQuery, types.CaptureShipRockScanQueryVariables>(CaptureShipRockScanDocument, options);
        }
export type CaptureShipRockScanQueryHookResult = ReturnType<typeof useCaptureShipRockScanQuery>;
export type CaptureShipRockScanLazyQueryHookResult = ReturnType<typeof useCaptureShipRockScanLazyQuery>;
export type CaptureShipRockScanSuspenseQueryHookResult = ReturnType<typeof useCaptureShipRockScanSuspenseQuery>;
export type CaptureShipRockScanQueryResult = Apollo.QueryResult<types.CaptureShipRockScanQuery, types.CaptureShipRockScanQueryVariables>;
export const CaptureRefineryOrderDocument = gql`
    query captureRefineryOrder($imgUrl: String!) {
  captureRefineryOrder(imgUrl: $imgUrl) {
    expenses {
      amount
      name
    }
    processDurationS
    refinery
    method
    shipOres {
      amt
      ore
      yield
    }
  }
}
    `;

/**
 * __useCaptureRefineryOrderQuery__
 *
 * To run a query within a React component, call `useCaptureRefineryOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaptureRefineryOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaptureRefineryOrderQuery({
 *   variables: {
 *      imgUrl: // value for 'imgUrl'
 *   },
 * });
 */
export function useCaptureRefineryOrderQuery(baseOptions: Apollo.QueryHookOptions<types.CaptureRefineryOrderQuery, types.CaptureRefineryOrderQueryVariables> & ({ variables: types.CaptureRefineryOrderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.CaptureRefineryOrderQuery, types.CaptureRefineryOrderQueryVariables>(CaptureRefineryOrderDocument, options);
      }
export function useCaptureRefineryOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.CaptureRefineryOrderQuery, types.CaptureRefineryOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.CaptureRefineryOrderQuery, types.CaptureRefineryOrderQueryVariables>(CaptureRefineryOrderDocument, options);
        }
export function useCaptureRefineryOrderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.CaptureRefineryOrderQuery, types.CaptureRefineryOrderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.CaptureRefineryOrderQuery, types.CaptureRefineryOrderQueryVariables>(CaptureRefineryOrderDocument, options);
        }
export type CaptureRefineryOrderQueryHookResult = ReturnType<typeof useCaptureRefineryOrderQuery>;
export type CaptureRefineryOrderLazyQueryHookResult = ReturnType<typeof useCaptureRefineryOrderLazyQuery>;
export type CaptureRefineryOrderSuspenseQueryHookResult = ReturnType<typeof useCaptureRefineryOrderSuspenseQuery>;
export type CaptureRefineryOrderQueryResult = Apollo.QueryResult<types.CaptureRefineryOrderQuery, types.CaptureRefineryOrderQueryVariables>;
export const GetPublicLookupsDocument = gql`
    query getPublicLookups {
  lookups {
    CIG {
      densitiesLookups
      oreProcessingLookup
      refineryBonusLookup
      methodsBonusLookup
    }
    UEX {
      bodies
      maxPrices
      ships
      tradeports
    }
    Loadout
  }
}
    `;

/**
 * __useGetPublicLookupsQuery__
 *
 * To run a query within a React component, call `useGetPublicLookupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicLookupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicLookupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPublicLookupsQuery(baseOptions?: Apollo.QueryHookOptions<types.GetPublicLookupsQuery, types.GetPublicLookupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetPublicLookupsQuery, types.GetPublicLookupsQueryVariables>(GetPublicLookupsDocument, options);
      }
export function useGetPublicLookupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetPublicLookupsQuery, types.GetPublicLookupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetPublicLookupsQuery, types.GetPublicLookupsQueryVariables>(GetPublicLookupsDocument, options);
        }
export function useGetPublicLookupsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<types.GetPublicLookupsQuery, types.GetPublicLookupsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<types.GetPublicLookupsQuery, types.GetPublicLookupsQueryVariables>(GetPublicLookupsDocument, options);
        }
export type GetPublicLookupsQueryHookResult = ReturnType<typeof useGetPublicLookupsQuery>;
export type GetPublicLookupsLazyQueryHookResult = ReturnType<typeof useGetPublicLookupsLazyQuery>;
export type GetPublicLookupsSuspenseQueryHookResult = ReturnType<typeof useGetPublicLookupsSuspenseQuery>;
export type GetPublicLookupsQueryResult = Apollo.QueryResult<types.GetPublicLookupsQuery, types.GetPublicLookupsQueryVariables>;