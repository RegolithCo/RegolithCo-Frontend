import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type APIEventKeySpecifier = ('ScoutingFindID' | 'createdAt' | 'orderId' | 'sessionId' | 'state' | 'type' | APIEventKeySpecifier)[];
export type APIEventFieldPolicy = {
	ScoutingFindID?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CrewShareKeySpecifier = ('createdAt' | 'note' | 'orderId' | 'scName' | 'session' | 'sessionId' | 'share' | 'shareType' | 'state' | 'updatedAt' | 'workOrder' | CrewShareKeySpecifier)[];
export type CrewShareFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	scName?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	share?: FieldPolicy<any> | FieldReadFunction<any>,
	shareType?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrder?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CrewShareTemplateKeySpecifier = ('note' | 'scName' | 'share' | 'shareType' | CrewShareTemplateKeySpecifier)[];
export type CrewShareTemplateFieldPolicy = {
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	scName?: FieldPolicy<any> | FieldReadFunction<any>,
	share?: FieldPolicy<any> | FieldReadFunction<any>,
	shareType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addFriends' | 'addScoutingFind' | 'addSessionMentions' | 'createSession' | 'createWorkOrder' | 'deleteCrewShare' | 'deleteScoutingFind' | 'deleteSession' | 'deleteUserProfile' | 'deleteWorkOrder' | 'failWorkOrder' | 'joinScoutingFind' | 'leaveScoutingFind' | 'leaveSession' | 'markCrewSharePaid' | 'refreshAvatar' | 'removeFriends' | 'removeSessionCrew' | 'removeSessionMentions' | 'requestVerifyUserProfile' | 'updateScoutingFind' | 'updateSession' | 'updateWorkOrder' | 'upsertCrewShare' | 'upsertSessionUser' | 'upsertUserProfile' | 'verifyUserProfile' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addFriends?: FieldPolicy<any> | FieldReadFunction<any>,
	addScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	addSessionMentions?: FieldPolicy<any> | FieldReadFunction<any>,
	createSession?: FieldPolicy<any> | FieldReadFunction<any>,
	createWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCrewShare?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteSession?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUserProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	failWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	joinScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	leaveScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	leaveSession?: FieldPolicy<any> | FieldReadFunction<any>,
	markCrewSharePaid?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshAvatar?: FieldPolicy<any> | FieldReadFunction<any>,
	removeFriends?: FieldPolicy<any> | FieldReadFunction<any>,
	removeSessionCrew?: FieldPolicy<any> | FieldReadFunction<any>,
	removeSessionMentions?: FieldPolicy<any> | FieldReadFunction<any>,
	requestVerifyUserProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	updateScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSession?: FieldPolicy<any> | FieldReadFunction<any>,
	updateWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	upsertCrewShare?: FieldPolicy<any> | FieldReadFunction<any>,
	upsertSessionUser?: FieldPolicy<any> | FieldReadFunction<any>,
	upsertUserProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyUserProfile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OtherOrderKeySpecifier = ('createdAt' | 'crewShares' | 'delegateSCName' | 'expenses' | 'failReason' | 'includeTransferFee' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | OtherOrderKeySpecifier)[];
export type OtherOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	delegateSCName?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedCrewSharesKeySpecifier = ('items' | 'nextToken' | PaginatedCrewSharesKeySpecifier)[];
export type PaginatedCrewSharesFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	nextToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedScoutingFindsKeySpecifier = ('items' | 'nextToken' | PaginatedScoutingFindsKeySpecifier)[];
export type PaginatedScoutingFindsFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	nextToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedSessionUsersKeySpecifier = ('items' | 'nextToken' | PaginatedSessionUsersKeySpecifier)[];
export type PaginatedSessionUsersFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	nextToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedSessionsKeySpecifier = ('items' | 'nextToken' | PaginatedSessionsKeySpecifier)[];
export type PaginatedSessionsFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	nextToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedUsersKeySpecifier = ('items' | 'nextToken' | PaginatedUsersKeySpecifier)[];
export type PaginatedUsersFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	nextToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PaginatedWorkOrdersKeySpecifier = ('items' | 'nextToken' | PaginatedWorkOrdersKeySpecifier)[];
export type PaginatedWorkOrdersFieldPolicy = {
	items?: FieldPolicy<any> | FieldReadFunction<any>,
	nextToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('crewShares' | 'profile' | 'scoutingFind' | 'session' | 'sessionUser' | 'user' | 'workOrder' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	profile?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionUser?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrder?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefineryRowKeySpecifier = ('amt' | 'ore' | RefineryRowKeySpecifier)[];
export type RefineryRowFieldPolicy = {
	amt?: FieldPolicy<any> | FieldReadFunction<any>,
	ore?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageFindKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'note' | 'owner' | 'ownerId' | 'scoutingFindId' | 'sessionId' | 'state' | 'updatedAt' | 'wrecks' | SalvageFindKeySpecifier)[];
export type SalvageFindFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	wrecks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageOrderKeySpecifier = ('createdAt' | 'crewShares' | 'delegateSCName' | 'expenses' | 'failReason' | 'includeTransferFee' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'salvageOres' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | SalvageOrderKeySpecifier)[];
export type SalvageOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	delegateSCName?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	salvageOres?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageRowKeySpecifier = ('amt' | 'ore' | SalvageRowKeySpecifier)[];
export type SalvageRowFieldPolicy = {
	amt?: FieldPolicy<any> | FieldReadFunction<any>,
	ore?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageWreckKeySpecifier = ('size' | SalvageWreckKeySpecifier)[];
export type SalvageWreckFieldPolicy = {
	size?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ScoutingFindInterfaceKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'note' | 'owner' | 'ownerId' | 'scoutingFindId' | 'sessionId' | 'state' | 'updatedAt' | ScoutingFindInterfaceKeySpecifier)[];
export type ScoutingFindInterfaceFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionKeySpecifier = ('activeMemberIds' | 'activeMembers' | 'createdAt' | 'finishedAt' | 'mentionedUsers' | 'name' | 'note' | 'onTheList' | 'owner' | 'ownerId' | 'scouting' | 'sessionId' | 'sessionSettings' | 'state' | 'summary' | 'updatedAt' | 'workOrders' | SessionKeySpecifier)[];
export type SessionFieldPolicy = {
	activeMemberIds?: FieldPolicy<any> | FieldReadFunction<any>,
	activeMembers?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	finishedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	mentionedUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	onTheList?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	scouting?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrders?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionSettingsKeySpecifier = ('activity' | 'allowUnverifiedUsers' | 'gravityWell' | 'location' | 'lockedFields' | 'specifyUsers' | 'workOrderDefaults' | SessionSettingsKeySpecifier)[];
export type SessionSettingsFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	allowUnverifiedUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	gravityWell?: FieldPolicy<any> | FieldReadFunction<any>,
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	lockedFields?: FieldPolicy<any> | FieldReadFunction<any>,
	specifyUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrderDefaults?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionSummaryKeySpecifier = ('aUEC' | 'activeMembers' | 'allPaid' | 'lastJobDone' | 'oreSCU' | 'refineries' | 'scoutingFinds' | 'totalMembers' | 'workOrders' | SessionSummaryKeySpecifier)[];
export type SessionSummaryFieldPolicy = {
	aUEC?: FieldPolicy<any> | FieldReadFunction<any>,
	activeMembers?: FieldPolicy<any> | FieldReadFunction<any>,
	allPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	lastJobDone?: FieldPolicy<any> | FieldReadFunction<any>,
	oreSCU?: FieldPolicy<any> | FieldReadFunction<any>,
	refineries?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFinds?: FieldPolicy<any> | FieldReadFunction<any>,
	totalMembers?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrders?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionSummaryTotalsKeySpecifier = ('other' | 'salvage' | 'ship' | 'vehicle' | SessionSummaryTotalsKeySpecifier)[];
export type SessionSummaryTotalsFieldPolicy = {
	other?: FieldPolicy<any> | FieldReadFunction<any>,
	salvage?: FieldPolicy<any> | FieldReadFunction<any>,
	ship?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicle?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionUserKeySpecifier = ('createdAt' | 'isPilot' | 'miningVehicle' | 'owner' | 'ownerId' | 'pilotSCName' | 'sessionId' | 'state' | 'updatedAt' | SessionUserKeySpecifier)[];
export type SessionUserFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	isPilot?: FieldPolicy<any> | FieldReadFunction<any>,
	miningVehicle?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	pilotSCName?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipClusterFindKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'note' | 'owner' | 'ownerId' | 'scoutingFindId' | 'sessionId' | 'shipRocks' | 'state' | 'updatedAt' | ShipClusterFindKeySpecifier)[];
export type ShipClusterFindFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shipRocks?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipMiningOrderKeySpecifier = ('createdAt' | 'crewShares' | 'delegateSCName' | 'expenses' | 'failReason' | 'includeTransferFee' | 'isRefined' | 'method' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'processStartTime' | 'refinery' | 'session' | 'sessionId' | 'shareAmount' | 'shareRefinedValue' | 'shipOres' | 'state' | 'updatedAt' | ShipMiningOrderKeySpecifier)[];
export type ShipMiningOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	delegateSCName?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefined?: FieldPolicy<any> | FieldReadFunction<any>,
	method?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	processStartTime?: FieldPolicy<any> | FieldReadFunction<any>,
	refinery?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	shareRefinedValue?: FieldPolicy<any> | FieldReadFunction<any>,
	shipOres?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipRockKeySpecifier = ('mass' | 'ores' | 'state' | ShipRockKeySpecifier)[];
export type ShipRockFieldPolicy = {
	mass?: FieldPolicy<any> | FieldReadFunction<any>,
	ores?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipRockOreKeySpecifier = ('ore' | 'percent' | ShipRockOreKeySpecifier)[];
export type ShipRockOreFieldPolicy = {
	ore?: FieldPolicy<any> | FieldReadFunction<any>,
	percent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SubscriptionKeySpecifier = ('apiSubscription' | SubscriptionKeySpecifier)[];
export type SubscriptionFieldPolicy = {
	apiSubscription?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('avatarUrl' | 'createdAt' | 'scName' | 'state' | 'updatedAt' | 'userId' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	avatarUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	scName?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserInterfaceKeySpecifier = ('avatarUrl' | 'createdAt' | 'scName' | 'state' | 'updatedAt' | 'userId' | UserInterfaceKeySpecifier)[];
export type UserInterfaceFieldPolicy = {
	avatarUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	scName?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserProfileKeySpecifier = ('avatarUrl' | 'createdAt' | 'crewSharesPayee' | 'crewSharesPayer' | 'deliveryShip' | 'friends' | 'joinedSessions' | 'mySessions' | 'scName' | 'sessionSettings' | 'state' | 'updatedAt' | 'userId' | 'userSettings' | 'verifyCode' | 'workOrders' | UserProfileKeySpecifier)[];
export type UserProfileFieldPolicy = {
	avatarUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewSharesPayee?: FieldPolicy<any> | FieldReadFunction<any>,
	crewSharesPayer?: FieldPolicy<any> | FieldReadFunction<any>,
	deliveryShip?: FieldPolicy<any> | FieldReadFunction<any>,
	friends?: FieldPolicy<any> | FieldReadFunction<any>,
	joinedSessions?: FieldPolicy<any> | FieldReadFunction<any>,
	mySessions?: FieldPolicy<any> | FieldReadFunction<any>,
	scName?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>,
	userSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyCode?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrders?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleClusterFindKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'note' | 'owner' | 'ownerId' | 'scoutingFindId' | 'sessionId' | 'state' | 'updatedAt' | 'vehicleRocks' | VehicleClusterFindKeySpecifier)[];
export type VehicleClusterFindFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicleRocks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleMiningOrderKeySpecifier = ('createdAt' | 'crewShares' | 'delegateSCName' | 'expenses' | 'failReason' | 'includeTransferFee' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | 'vehicleOres' | VehicleMiningOrderKeySpecifier)[];
export type VehicleMiningOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	delegateSCName?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicleOres?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleMiningRowKeySpecifier = ('amt' | 'ore' | VehicleMiningRowKeySpecifier)[];
export type VehicleMiningRowFieldPolicy = {
	amt?: FieldPolicy<any> | FieldReadFunction<any>,
	ore?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleRockKeySpecifier = ('mass' | 'ores' | VehicleRockKeySpecifier)[];
export type VehicleRockFieldPolicy = {
	mass?: FieldPolicy<any> | FieldReadFunction<any>,
	ores?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleRockOreKeySpecifier = ('ore' | 'percent' | VehicleRockOreKeySpecifier)[];
export type VehicleRockOreFieldPolicy = {
	ore?: FieldPolicy<any> | FieldReadFunction<any>,
	percent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WorkOrderDefaultsKeySpecifier = ('crewShares' | 'includeTransferFee' | 'isRefined' | 'lockedFields' | 'method' | 'refinery' | 'salvageOres' | 'shareRefinedValue' | 'shipOres' | 'vehicleOres' | WorkOrderDefaultsKeySpecifier)[];
export type WorkOrderDefaultsFieldPolicy = {
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefined?: FieldPolicy<any> | FieldReadFunction<any>,
	lockedFields?: FieldPolicy<any> | FieldReadFunction<any>,
	method?: FieldPolicy<any> | FieldReadFunction<any>,
	refinery?: FieldPolicy<any> | FieldReadFunction<any>,
	salvageOres?: FieldPolicy<any> | FieldReadFunction<any>,
	shareRefinedValue?: FieldPolicy<any> | FieldReadFunction<any>,
	shipOres?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicleOres?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WorkOrderExpenseKeySpecifier = ('amount' | 'name' | WorkOrderExpenseKeySpecifier)[];
export type WorkOrderExpenseFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WorkOrderInterfaceKeySpecifier = ('createdAt' | 'crewShares' | 'delegateSCName' | 'expenses' | 'failReason' | 'includeTransferFee' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | WorkOrderInterfaceKeySpecifier)[];
export type WorkOrderInterfaceFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	delegateSCName?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	APIEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | APIEventKeySpecifier | (() => undefined | APIEventKeySpecifier),
		fields?: APIEventFieldPolicy,
	},
	CrewShare?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CrewShareKeySpecifier | (() => undefined | CrewShareKeySpecifier),
		fields?: CrewShareFieldPolicy,
	},
	CrewShareTemplate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CrewShareTemplateKeySpecifier | (() => undefined | CrewShareTemplateKeySpecifier),
		fields?: CrewShareTemplateFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	OtherOrder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | OtherOrderKeySpecifier | (() => undefined | OtherOrderKeySpecifier),
		fields?: OtherOrderFieldPolicy,
	},
	PaginatedCrewShares?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedCrewSharesKeySpecifier | (() => undefined | PaginatedCrewSharesKeySpecifier),
		fields?: PaginatedCrewSharesFieldPolicy,
	},
	PaginatedScoutingFinds?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedScoutingFindsKeySpecifier | (() => undefined | PaginatedScoutingFindsKeySpecifier),
		fields?: PaginatedScoutingFindsFieldPolicy,
	},
	PaginatedSessionUsers?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedSessionUsersKeySpecifier | (() => undefined | PaginatedSessionUsersKeySpecifier),
		fields?: PaginatedSessionUsersFieldPolicy,
	},
	PaginatedSessions?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedSessionsKeySpecifier | (() => undefined | PaginatedSessionsKeySpecifier),
		fields?: PaginatedSessionsFieldPolicy,
	},
	PaginatedUsers?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedUsersKeySpecifier | (() => undefined | PaginatedUsersKeySpecifier),
		fields?: PaginatedUsersFieldPolicy,
	},
	PaginatedWorkOrders?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PaginatedWorkOrdersKeySpecifier | (() => undefined | PaginatedWorkOrdersKeySpecifier),
		fields?: PaginatedWorkOrdersFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	RefineryRow?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefineryRowKeySpecifier | (() => undefined | RefineryRowKeySpecifier),
		fields?: RefineryRowFieldPolicy,
	},
	SalvageFind?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SalvageFindKeySpecifier | (() => undefined | SalvageFindKeySpecifier),
		fields?: SalvageFindFieldPolicy,
	},
	SalvageOrder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SalvageOrderKeySpecifier | (() => undefined | SalvageOrderKeySpecifier),
		fields?: SalvageOrderFieldPolicy,
	},
	SalvageRow?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SalvageRowKeySpecifier | (() => undefined | SalvageRowKeySpecifier),
		fields?: SalvageRowFieldPolicy,
	},
	SalvageWreck?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SalvageWreckKeySpecifier | (() => undefined | SalvageWreckKeySpecifier),
		fields?: SalvageWreckFieldPolicy,
	},
	ScoutingFindInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ScoutingFindInterfaceKeySpecifier | (() => undefined | ScoutingFindInterfaceKeySpecifier),
		fields?: ScoutingFindInterfaceFieldPolicy,
	},
	Session?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionKeySpecifier | (() => undefined | SessionKeySpecifier),
		fields?: SessionFieldPolicy,
	},
	SessionSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionSettingsKeySpecifier | (() => undefined | SessionSettingsKeySpecifier),
		fields?: SessionSettingsFieldPolicy,
	},
	SessionSummary?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionSummaryKeySpecifier | (() => undefined | SessionSummaryKeySpecifier),
		fields?: SessionSummaryFieldPolicy,
	},
	SessionSummaryTotals?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionSummaryTotalsKeySpecifier | (() => undefined | SessionSummaryTotalsKeySpecifier),
		fields?: SessionSummaryTotalsFieldPolicy,
	},
	SessionUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionUserKeySpecifier | (() => undefined | SessionUserKeySpecifier),
		fields?: SessionUserFieldPolicy,
	},
	ShipClusterFind?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipClusterFindKeySpecifier | (() => undefined | ShipClusterFindKeySpecifier),
		fields?: ShipClusterFindFieldPolicy,
	},
	ShipMiningOrder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipMiningOrderKeySpecifier | (() => undefined | ShipMiningOrderKeySpecifier),
		fields?: ShipMiningOrderFieldPolicy,
	},
	ShipRock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipRockKeySpecifier | (() => undefined | ShipRockKeySpecifier),
		fields?: ShipRockFieldPolicy,
	},
	ShipRockOre?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipRockOreKeySpecifier | (() => undefined | ShipRockOreKeySpecifier),
		fields?: ShipRockOreFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserInterfaceKeySpecifier | (() => undefined | UserInterfaceKeySpecifier),
		fields?: UserInterfaceFieldPolicy,
	},
	UserProfile?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserProfileKeySpecifier | (() => undefined | UserProfileKeySpecifier),
		fields?: UserProfileFieldPolicy,
	},
	VehicleClusterFind?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VehicleClusterFindKeySpecifier | (() => undefined | VehicleClusterFindKeySpecifier),
		fields?: VehicleClusterFindFieldPolicy,
	},
	VehicleMiningOrder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VehicleMiningOrderKeySpecifier | (() => undefined | VehicleMiningOrderKeySpecifier),
		fields?: VehicleMiningOrderFieldPolicy,
	},
	VehicleMiningRow?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VehicleMiningRowKeySpecifier | (() => undefined | VehicleMiningRowKeySpecifier),
		fields?: VehicleMiningRowFieldPolicy,
	},
	VehicleRock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VehicleRockKeySpecifier | (() => undefined | VehicleRockKeySpecifier),
		fields?: VehicleRockFieldPolicy,
	},
	VehicleRockOre?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VehicleRockOreKeySpecifier | (() => undefined | VehicleRockOreKeySpecifier),
		fields?: VehicleRockOreFieldPolicy,
	},
	WorkOrderDefaults?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WorkOrderDefaultsKeySpecifier | (() => undefined | WorkOrderDefaultsKeySpecifier),
		fields?: WorkOrderDefaultsFieldPolicy,
	},
	WorkOrderExpense?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WorkOrderExpenseKeySpecifier | (() => undefined | WorkOrderExpenseKeySpecifier),
		fields?: WorkOrderExpenseFieldPolicy,
	},
	WorkOrderInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | WorkOrderInterfaceKeySpecifier | (() => undefined | WorkOrderInterfaceKeySpecifier),
		fields?: WorkOrderInterfaceFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;