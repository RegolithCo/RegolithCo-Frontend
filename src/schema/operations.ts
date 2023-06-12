import * as types from '@regolithco/common'
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const WorkOrderListFragmentFragmentDoc = gql`
    fragment WorkOrderListFragment on WorkOrderInterface {
  orderId
  sessionId
  createdAt
  updatedAt
  ownerId
  sellerscName
  state
  failReason
  includeTransferFee
  orderType
  note
}
    `;
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
  sessionId
  updatedAt
  failReason
  ownerId
  sellerscName
  shareAmount
  sellStore
  state
}
    `;
export const SessionIdFragmentFragmentDoc = gql`
    fragment SessionIdFragment on Session {
  sessionId
  updatedAt
  state
  name
}
    `;
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
export const SessionSettingFragmentFragmentDoc = gql`
    fragment SessionSettingFragment on SessionSettings {
  activity
  allowUnverifiedUsers
  gravityWell
  location
  lockedFields
  specifyUsers
  workOrderDefaults {
    includeTransferFee
    crewShares {
      note
      scName
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
    workOrders {
      other
      salvage
      ship
      vehicle
    }
    scoutingFinds {
      salvage
      ship
      vehicle
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
export const VehicleFragmentFragmentDoc = gql`
    fragment VehicleFragment on Vehicle {
  maker
  name
  code
  cargo
  miningHold
  role
  buyAt
  rentAt
}
    `;
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
export const SessionUserFragmentFragmentDoc = gql`
    fragment SessionUserFragment on SessionUser {
  sessionId
  ownerId
  owner {
    ...UserFragment
  }
  createdAt
  updatedAt
  isPilot
  pilotSCName
  vehicle {
    ...VehicleFragment
  }
  loadout {
    ...MiningLoadoutFragment
  }
  state
}
    ${UserFragmentFragmentDoc}
${VehicleFragmentFragmentDoc}
${MiningLoadoutFragmentFragmentDoc}`;
export const ScoutingFindFragmentFragmentDoc = gql`
    fragment ScoutingFindFragment on ScoutingFindInterface {
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
  state
  attendanceIds
  attendance {
    ...SessionUserFragment
  }
  ... on ShipClusterFind {
    shipRocks {
      mass
      state
      ores {
        ore
        percent
      }
    }
  }
  ... on VehicleClusterFind {
    vehicleRocks {
      mass
      ores {
        ore
        percent
      }
    }
  }
  ... on SalvageFind {
    wrecks {
      size
    }
  }
}
    ${UserFragmentFragmentDoc}
${SessionUserFragmentFragmentDoc}`;
export const CrewShareFragmentFragmentDoc = gql`
    fragment CrewShareFragment on CrewShare {
  sessionId
  scName
  orderId
  shareType
  share
  note
  state
  createdAt
  updatedAt
}
    `;
export const WorkOrderFragmentFragmentDoc = gql`
    fragment WorkOrderFragment on WorkOrderInterface {
  orderId
  sessionId
  createdAt
  updatedAt
  ownerId
  sellerscName
  owner {
    ...UserFragment
  }
  state
  failReason
  includeTransferFee
  orderType
  note
  shareAmount
  sellStore
  crewShares {
    ...CrewShareFragment
  }
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
    ${UserFragmentFragmentDoc}
${CrewShareFragmentFragmentDoc}`;
export const SessionFragmentFragmentDoc = gql`
    fragment SessionFragment on Session {
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
  mentionedUsers
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
    ${UserFragmentFragmentDoc}
${SessionSettingFragmentFragmentDoc}
${SessionUserFragmentFragmentDoc}
${ScoutingFindFragmentFragmentDoc}
${WorkOrderFragmentFragmentDoc}`;
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
export const UserProfileFragmentFragmentDoc = gql`
    fragment UserProfileFragment on UserProfile {
  userId
  scName
  avatarUrl
  createdAt
  updatedAt
  state
  verifyCode
  deliveryShipCode
  sessionSettings {
    ...SessionSettingFragment
  }
  userSettings
  friends
}
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
  upsertUserProfile(
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
export const AddFriendsDocument = gql`
    mutation addFriends($friends: [String]!) {
  addFriends(friends: $friends) {
    userId
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
export const DeleteWorkOrderDocument = gql`
    mutation deleteWorkOrder($sessionId: ID!, $orderId: ID!) {
  deleteWorkOrder(sessionId: $sessionId, orderId: $orderId) {
    ...WorkOrderIdFragment
  }
}
    ${WorkOrderIdFragmentFragmentDoc}`;
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
  }
}
    ${SessionUpdateFragmentFragmentDoc}`;
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
    mentionedUsers
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
    mentionedUsers
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
    mentionedUsers
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
    mutation markCrewSharePaid($sessionId: ID!, $orderId: ID!, $scName: String!, $isPaid: Boolean!) {
  markCrewSharePaid(
    sessionId: $sessionId
    orderId: $orderId
    scName: $scName
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
 *      scName: // value for 'scName'
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
    mutation deleteCrewShare($sessionId: ID!, $orderId: ID!, $scName: String!) {
  deleteCrewShare(sessionId: $sessionId, orderId: $orderId, scName: $scName) {
    sessionId
    orderId
    scName
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
 *      scName: // value for 'scName'
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
    ...ScoutingIdFragment
  }
}
    ${ScoutingIdFragmentFragmentDoc}`;
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
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
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
export type GetLoadoutsQueryHookResult = ReturnType<typeof useGetLoadoutsQuery>;
export type GetLoadoutsLazyQueryHookResult = ReturnType<typeof useGetLoadoutsLazyQuery>;
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
export function useGetSessionUserQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>(GetSessionUserDocument, options);
      }
export function useGetSessionUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>(GetSessionUserDocument, options);
        }
export type GetSessionUserQueryHookResult = ReturnType<typeof useGetSessionUserQuery>;
export type GetSessionUserLazyQueryHookResult = ReturnType<typeof useGetSessionUserLazyQuery>;
export type GetSessionUserQueryResult = Apollo.QueryResult<types.GetSessionUserQuery, types.GetSessionUserQueryVariables>;
export const GetMyUserSessionsDocument = gql`
    query getMyUserSessions($nextToken: String) {
  profile {
    userId
    mySessions(nextToken: $nextToken) {
      items {
        ...SessionListFragment
        ...SessionSummaryFragment
      }
      nextToken
    }
  }
}
    ${SessionListFragmentFragmentDoc}
${SessionSummaryFragmentFragmentDoc}`;

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
export type GetMyUserSessionsQueryHookResult = ReturnType<typeof useGetMyUserSessionsQuery>;
export type GetMyUserSessionsLazyQueryHookResult = ReturnType<typeof useGetMyUserSessionsLazyQuery>;
export type GetMyUserSessionsQueryResult = Apollo.QueryResult<types.GetMyUserSessionsQuery, types.GetMyUserSessionsQueryVariables>;
export const GetJoinedUserSessionsDocument = gql`
    query getJoinedUserSessions($nextToken: String) {
  profile {
    userId
    joinedSessions(nextToken: $nextToken) {
      items {
        ...SessionListFragment
        ...SessionSummaryFragment
      }
      nextToken
    }
  }
}
    ${SessionListFragmentFragmentDoc}
${SessionSummaryFragmentFragmentDoc}`;

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
export type GetJoinedUserSessionsQueryHookResult = ReturnType<typeof useGetJoinedUserSessionsQuery>;
export type GetJoinedUserSessionsLazyQueryHookResult = ReturnType<typeof useGetJoinedUserSessionsLazyQuery>;
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
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<types.GetUserQuery, types.GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetUserQuery, types.GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetUserQuery, types.GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetUserQuery, types.GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
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
export function useGetSessionQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionQuery, types.GetSessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionQuery, types.GetSessionQueryVariables>(GetSessionDocument, options);
      }
export function useGetSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionQuery, types.GetSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionQuery, types.GetSessionQueryVariables>(GetSessionDocument, options);
        }
export type GetSessionQueryHookResult = ReturnType<typeof useGetSessionQuery>;
export type GetSessionLazyQueryHookResult = ReturnType<typeof useGetSessionLazyQuery>;
export type GetSessionQueryResult = Apollo.QueryResult<types.GetSessionQuery, types.GetSessionQueryVariables>;
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
export function useGetSessionStubQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>(GetSessionStubDocument, options);
      }
export function useGetSessionStubLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionStubQuery, types.GetSessionStubQueryVariables>(GetSessionStubDocument, options);
        }
export type GetSessionStubQueryHookResult = ReturnType<typeof useGetSessionStubQuery>;
export type GetSessionStubLazyQueryHookResult = ReturnType<typeof useGetSessionStubLazyQuery>;
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
export function useGetSessionScoutingQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>(GetSessionScoutingDocument, options);
      }
export function useGetSessionScoutingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionScoutingQuery, types.GetSessionScoutingQueryVariables>(GetSessionScoutingDocument, options);
        }
export type GetSessionScoutingQueryHookResult = ReturnType<typeof useGetSessionScoutingQuery>;
export type GetSessionScoutingLazyQueryHookResult = ReturnType<typeof useGetSessionScoutingLazyQuery>;
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
export function useGetSessionActiveMembersQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>(GetSessionActiveMembersDocument, options);
      }
export function useGetSessionActiveMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionActiveMembersQuery, types.GetSessionActiveMembersQueryVariables>(GetSessionActiveMembersDocument, options);
        }
export type GetSessionActiveMembersQueryHookResult = ReturnType<typeof useGetSessionActiveMembersQuery>;
export type GetSessionActiveMembersLazyQueryHookResult = ReturnType<typeof useGetSessionActiveMembersLazyQuery>;
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
export function useGetSessionWorkOrdersQuery(baseOptions: Apollo.QueryHookOptions<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>(GetSessionWorkOrdersDocument, options);
      }
export function useGetSessionWorkOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetSessionWorkOrdersQuery, types.GetSessionWorkOrdersQueryVariables>(GetSessionWorkOrdersDocument, options);
        }
export type GetSessionWorkOrdersQueryHookResult = ReturnType<typeof useGetSessionWorkOrdersQuery>;
export type GetSessionWorkOrdersLazyQueryHookResult = ReturnType<typeof useGetSessionWorkOrdersLazyQuery>;
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
export function useGetWorkOrderQuery(baseOptions: Apollo.QueryHookOptions<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>(GetWorkOrderDocument, options);
      }
export function useGetWorkOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetWorkOrderQuery, types.GetWorkOrderQueryVariables>(GetWorkOrderDocument, options);
        }
export type GetWorkOrderQueryHookResult = ReturnType<typeof useGetWorkOrderQuery>;
export type GetWorkOrderLazyQueryHookResult = ReturnType<typeof useGetWorkOrderLazyQuery>;
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
export function useGetScoutingFindQuery(baseOptions: Apollo.QueryHookOptions<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>(GetScoutingFindDocument, options);
      }
export function useGetScoutingFindLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetScoutingFindQuery, types.GetScoutingFindQueryVariables>(GetScoutingFindDocument, options);
        }
export type GetScoutingFindQueryHookResult = ReturnType<typeof useGetScoutingFindQuery>;
export type GetScoutingFindLazyQueryHookResult = ReturnType<typeof useGetScoutingFindLazyQuery>;
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
export function useGetCrewSharesQuery(baseOptions: Apollo.QueryHookOptions<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>(GetCrewSharesDocument, options);
      }
export function useGetCrewSharesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>(GetCrewSharesDocument, options);
        }
export type GetCrewSharesQueryHookResult = ReturnType<typeof useGetCrewSharesQuery>;
export type GetCrewSharesLazyQueryHookResult = ReturnType<typeof useGetCrewSharesLazyQuery>;
export type GetCrewSharesQueryResult = Apollo.QueryResult<types.GetCrewSharesQuery, types.GetCrewSharesQueryVariables>;