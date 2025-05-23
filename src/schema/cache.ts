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
export type ActiveMiningLaserLoadoutKeySpecifier = ('laser' | 'laserActive' | 'modules' | 'modulesActive' | ActiveMiningLaserLoadoutKeySpecifier)[];
export type ActiveMiningLaserLoadoutFieldPolicy = {
	laser?: FieldPolicy<any> | FieldReadFunction<any>,
	laserActive?: FieldPolicy<any> | FieldReadFunction<any>,
	modules?: FieldPolicy<any> | FieldReadFunction<any>,
	modulesActive?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CIGLookupsKeySpecifier = ('densitiesLookups' | 'methodsBonusLookup' | 'oreProcessingLookup' | 'refineryBonusLookup' | CIGLookupsKeySpecifier)[];
export type CIGLookupsFieldPolicy = {
	densitiesLookups?: FieldPolicy<any> | FieldReadFunction<any>,
	methodsBonusLookup?: FieldPolicy<any> | FieldReadFunction<any>,
	oreProcessingLookup?: FieldPolicy<any> | FieldReadFunction<any>,
	refineryBonusLookup?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CrewShareKeySpecifier = ('createdAt' | 'note' | 'orderId' | 'payeeScName' | 'payeeUserId' | 'session' | 'sessionId' | 'share' | 'shareType' | 'state' | 'updatedAt' | 'workOrder' | CrewShareKeySpecifier)[];
export type CrewShareFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	payeeScName?: FieldPolicy<any> | FieldReadFunction<any>,
	payeeUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	share?: FieldPolicy<any> | FieldReadFunction<any>,
	shareType?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrder?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CrewShareTemplateKeySpecifier = ('note' | 'payeeScName' | 'share' | 'shareType' | CrewShareTemplateKeySpecifier)[];
export type CrewShareTemplateFieldPolicy = {
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	payeeScName?: FieldPolicy<any> | FieldReadFunction<any>,
	share?: FieldPolicy<any> | FieldReadFunction<any>,
	shareType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DiscordGuildKeySpecifier = ('iconUrl' | 'id' | 'name' | DiscordGuildKeySpecifier)[];
export type DiscordGuildFieldPolicy = {
	iconUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DiscordGuildInterfaceKeySpecifier = ('iconUrl' | 'id' | 'name' | DiscordGuildInterfaceKeySpecifier)[];
export type DiscordGuildInterfaceFieldPolicy = {
	iconUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LookupDataKeySpecifier = ('CIG' | 'UEX' | 'loadout' | LookupDataKeySpecifier)[];
export type LookupDataFieldPolicy = {
	CIG?: FieldPolicy<any> | FieldReadFunction<any>,
	UEX?: FieldPolicy<any> | FieldReadFunction<any>,
	loadout?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MiningLoadoutKeySpecifier = ('activeGadgetIndex' | 'activeLasers' | 'createdAt' | 'inventoryGadgets' | 'inventoryLasers' | 'inventoryModules' | 'loadoutId' | 'name' | 'owner' | 'ship' | 'updatedAt' | MiningLoadoutKeySpecifier)[];
export type MiningLoadoutFieldPolicy = {
	activeGadgetIndex?: FieldPolicy<any> | FieldReadFunction<any>,
	activeLasers?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	inventoryGadgets?: FieldPolicy<any> | FieldReadFunction<any>,
	inventoryLasers?: FieldPolicy<any> | FieldReadFunction<any>,
	inventoryModules?: FieldPolicy<any> | FieldReadFunction<any>,
	loadoutId?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ship?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('addFriends' | 'addScoutingFind' | 'addSessionMentions' | 'blockProspector' | 'claimWorkOrder' | 'createLoadout' | 'createSession' | 'createWorkOrder' | 'deleteCrewShare' | 'deleteLoadout' | 'deleteScoutingFind' | 'deleteSession' | 'deleteUserProfile' | 'deleteWorkOrder' | 'deliverWorkOrder' | 'failWorkOrder' | 'joinScoutingFind' | 'joinSession' | 'leaveScoutingFind' | 'leaveSession' | 'markCrewSharePaid' | 'mergeAccount' | 'mergeAccountAdmin' | 'refreshAvatar' | 'removeFriends' | 'removeSessionCrew' | 'removeSessionMentions' | 'requestVerifyUserProfile' | 'rotateShareId' | 'setLookupData' | 'setUserPlan' | 'updateLoadout' | 'updatePendingUsers' | 'updateScoutingFind' | 'updateSession' | 'updateSessionUser' | 'updateUserProfile' | 'updateWorkOrder' | 'upsertCrewShare' | 'upsertSessionUser' | 'userAPIKey' | 'verifyUserProfile' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	addFriends?: FieldPolicy<any> | FieldReadFunction<any>,
	addScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	addSessionMentions?: FieldPolicy<any> | FieldReadFunction<any>,
	blockProspector?: FieldPolicy<any> | FieldReadFunction<any>,
	claimWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	createLoadout?: FieldPolicy<any> | FieldReadFunction<any>,
	createSession?: FieldPolicy<any> | FieldReadFunction<any>,
	createWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteCrewShare?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteLoadout?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteSession?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteUserProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	deleteWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	deliverWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	failWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	joinScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	joinSession?: FieldPolicy<any> | FieldReadFunction<any>,
	leaveScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	leaveSession?: FieldPolicy<any> | FieldReadFunction<any>,
	markCrewSharePaid?: FieldPolicy<any> | FieldReadFunction<any>,
	mergeAccount?: FieldPolicy<any> | FieldReadFunction<any>,
	mergeAccountAdmin?: FieldPolicy<any> | FieldReadFunction<any>,
	refreshAvatar?: FieldPolicy<any> | FieldReadFunction<any>,
	removeFriends?: FieldPolicy<any> | FieldReadFunction<any>,
	removeSessionCrew?: FieldPolicy<any> | FieldReadFunction<any>,
	removeSessionMentions?: FieldPolicy<any> | FieldReadFunction<any>,
	requestVerifyUserProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	rotateShareId?: FieldPolicy<any> | FieldReadFunction<any>,
	setLookupData?: FieldPolicy<any> | FieldReadFunction<any>,
	setUserPlan?: FieldPolicy<any> | FieldReadFunction<any>,
	updateLoadout?: FieldPolicy<any> | FieldReadFunction<any>,
	updatePendingUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	updateScoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSession?: FieldPolicy<any> | FieldReadFunction<any>,
	updateSessionUser?: FieldPolicy<any> | FieldReadFunction<any>,
	updateUserProfile?: FieldPolicy<any> | FieldReadFunction<any>,
	updateWorkOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	upsertCrewShare?: FieldPolicy<any> | FieldReadFunction<any>,
	upsertSessionUser?: FieldPolicy<any> | FieldReadFunction<any>,
	userAPIKey?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyUserProfile?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MyDiscordGuildKeySpecifier = ('hasPermission' | 'iconUrl' | 'id' | 'name' | MyDiscordGuildKeySpecifier)[];
export type MyDiscordGuildFieldPolicy = {
	hasPermission?: FieldPolicy<any> | FieldReadFunction<any>,
	iconUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type OtherOrderKeySpecifier = ('createdAt' | 'crewShares' | 'expenses' | 'failReason' | 'includeTransferFee' | 'isSold' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'sellStore' | 'seller' | 'sellerUserId' | 'sellerscName' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | 'version' | OtherOrderKeySpecifier)[];
export type OtherOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isSold?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellStore?: FieldPolicy<any> | FieldReadFunction<any>,
	seller?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerscName?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
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
export type PendingUserKeySpecifier = ('captainId' | 'scName' | 'sessionRole' | 'shipRole' | PendingUserKeySpecifier)[];
export type PendingUserFieldPolicy = {
	captainId?: FieldPolicy<any> | FieldReadFunction<any>,
	scName?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionRole?: FieldPolicy<any> | FieldReadFunction<any>,
	shipRole?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('captureRefineryOrder' | 'captureShipRockScan' | 'crewShares' | 'lookups' | 'profile' | 'scoutingFind' | 'session' | 'sessionShare' | 'sessionUpdates' | 'sessionUser' | 'surveyData' | 'user' | 'workOrder' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	captureRefineryOrder?: FieldPolicy<any> | FieldReadFunction<any>,
	captureShipRockScan?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	lookups?: FieldPolicy<any> | FieldReadFunction<any>,
	profile?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFind?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionShare?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionUpdates?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionUser?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyData?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrder?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefineryRowKeySpecifier = ('amt' | 'ore' | 'yield' | RefineryRowKeySpecifier)[];
export type RefineryRowFieldPolicy = {
	amt?: FieldPolicy<any> | FieldReadFunction<any>,
	ore?: FieldPolicy<any> | FieldReadFunction<any>,
	yield?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RefineryRowCaptureKeySpecifier = ('amt' | 'ore' | 'yield' | RefineryRowCaptureKeySpecifier)[];
export type RefineryRowCaptureFieldPolicy = {
	amt?: FieldPolicy<any> | FieldReadFunction<any>,
	ore?: FieldPolicy<any> | FieldReadFunction<any>,
	yield?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageFindKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'gravityWell' | 'includeInSurvey' | 'note' | 'owner' | 'ownerId' | 'rawScore' | 'score' | 'scoutingFindId' | 'sessionId' | 'state' | 'surveyBonus' | 'updatedAt' | 'version' | 'wrecks' | SalvageFindKeySpecifier)[];
export type SalvageFindFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	gravityWell?: FieldPolicy<any> | FieldReadFunction<any>,
	includeInSurvey?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	rawScore?: FieldPolicy<any> | FieldReadFunction<any>,
	score?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyBonus?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	wrecks?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageOrderKeySpecifier = ('createdAt' | 'crewShares' | 'expenses' | 'failReason' | 'includeTransferFee' | 'isSold' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'salvageOres' | 'sellStore' | 'seller' | 'sellerUserId' | 'sellerscName' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | 'version' | SalvageOrderKeySpecifier)[];
export type SalvageOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isSold?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	salvageOres?: FieldPolicy<any> | FieldReadFunction<any>,
	sellStore?: FieldPolicy<any> | FieldReadFunction<any>,
	seller?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerscName?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageRowKeySpecifier = ('amt' | 'ore' | SalvageRowKeySpecifier)[];
export type SalvageRowFieldPolicy = {
	amt?: FieldPolicy<any> | FieldReadFunction<any>,
	ore?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageWreckKeySpecifier = ('isShip' | 'salvageOres' | 'sellableAUEC' | 'shipCode' | 'state' | SalvageWreckKeySpecifier)[];
export type SalvageWreckFieldPolicy = {
	isShip?: FieldPolicy<any> | FieldReadFunction<any>,
	salvageOres?: FieldPolicy<any> | FieldReadFunction<any>,
	sellableAUEC?: FieldPolicy<any> | FieldReadFunction<any>,
	shipCode?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SalvageWreckOreKeySpecifier = ('ore' | 'scu' | SalvageWreckOreKeySpecifier)[];
export type SalvageWreckOreFieldPolicy = {
	ore?: FieldPolicy<any> | FieldReadFunction<any>,
	scu?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ScoutingFindInterfaceKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'gravityWell' | 'includeInSurvey' | 'note' | 'owner' | 'ownerId' | 'rawScore' | 'score' | 'scoutingFindId' | 'sessionId' | 'state' | 'surveyBonus' | 'updatedAt' | 'version' | ScoutingFindInterfaceKeySpecifier)[];
export type ScoutingFindInterfaceFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	gravityWell?: FieldPolicy<any> | FieldReadFunction<any>,
	includeInSurvey?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	rawScore?: FieldPolicy<any> | FieldReadFunction<any>,
	score?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyBonus?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SellStoresKeySpecifier = ('gem' | 'oreRaw' | 'oreRefined' | 'salvage' | SellStoresKeySpecifier)[];
export type SellStoresFieldPolicy = {
	gem?: FieldPolicy<any> | FieldReadFunction<any>,
	oreRaw?: FieldPolicy<any> | FieldReadFunction<any>,
	oreRefined?: FieldPolicy<any> | FieldReadFunction<any>,
	salvage?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionKeySpecifier = ('activeMemberIds' | 'activeMembers' | 'createdAt' | 'finishedAt' | 'joinId' | 'mentionedUsers' | 'name' | 'note' | 'onTheList' | 'owner' | 'ownerId' | 'scouting' | 'sessionId' | 'sessionSettings' | 'state' | 'summary' | 'updatedAt' | 'version' | 'workOrders' | SessionKeySpecifier)[];
export type SessionFieldPolicy = {
	activeMemberIds?: FieldPolicy<any> | FieldReadFunction<any>,
	activeMembers?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	finishedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	joinId?: FieldPolicy<any> | FieldReadFunction<any>,
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
	version?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrders?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionSettingsKeySpecifier = ('activity' | 'allowUnverifiedUsers' | 'controlledSessionRole' | 'controlledShipRole' | 'gravityWell' | 'location' | 'lockToDiscordGuild' | 'lockedFields' | 'specifyUsers' | 'systemFilter' | 'usersCanAddUsers' | 'usersCanInviteUsers' | 'workOrderDefaults' | SessionSettingsKeySpecifier)[];
export type SessionSettingsFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	allowUnverifiedUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	controlledSessionRole?: FieldPolicy<any> | FieldReadFunction<any>,
	controlledShipRole?: FieldPolicy<any> | FieldReadFunction<any>,
	gravityWell?: FieldPolicy<any> | FieldReadFunction<any>,
	location?: FieldPolicy<any> | FieldReadFunction<any>,
	lockToDiscordGuild?: FieldPolicy<any> | FieldReadFunction<any>,
	lockedFields?: FieldPolicy<any> | FieldReadFunction<any>,
	specifyUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	systemFilter?: FieldPolicy<any> | FieldReadFunction<any>,
	usersCanAddUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	usersCanInviteUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrderDefaults?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionShareKeySpecifier = ('activity' | 'allowUnverifiedUsers' | 'createdAt' | 'finishedAt' | 'lockToDiscordGuild' | 'name' | 'note' | 'onTheList' | 'sessionId' | 'specifyUsers' | 'state' | 'updatedAt' | 'version' | SessionShareKeySpecifier)[];
export type SessionShareFieldPolicy = {
	activity?: FieldPolicy<any> | FieldReadFunction<any>,
	allowUnverifiedUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	finishedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	lockToDiscordGuild?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	onTheList?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	specifyUsers?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionSummaryKeySpecifier = ('aUEC' | 'activeMembers' | 'allPaid' | 'collectedSCU' | 'lastJobDone' | 'refineries' | 'scoutingFindsByType' | 'totalMembers' | 'workOrderSummaries' | 'workOrdersByType' | 'yieldSCU' | SessionSummaryKeySpecifier)[];
export type SessionSummaryFieldPolicy = {
	aUEC?: FieldPolicy<any> | FieldReadFunction<any>,
	activeMembers?: FieldPolicy<any> | FieldReadFunction<any>,
	allPaid?: FieldPolicy<any> | FieldReadFunction<any>,
	collectedSCU?: FieldPolicy<any> | FieldReadFunction<any>,
	lastJobDone?: FieldPolicy<any> | FieldReadFunction<any>,
	refineries?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindsByType?: FieldPolicy<any> | FieldReadFunction<any>,
	totalMembers?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrderSummaries?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrdersByType?: FieldPolicy<any> | FieldReadFunction<any>,
	yieldSCU?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionSummaryTotalsKeySpecifier = ('other' | 'salvage' | 'ship' | 'vehicle' | SessionSummaryTotalsKeySpecifier)[];
export type SessionSummaryTotalsFieldPolicy = {
	other?: FieldPolicy<any> | FieldReadFunction<any>,
	salvage?: FieldPolicy<any> | FieldReadFunction<any>,
	ship?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicle?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionSummaryWorkOrderKeySpecifier = ('isFailed' | 'isSold' | 'orderType' | 'paidShares' | 'unpaidShares' | SessionSummaryWorkOrderKeySpecifier)[];
export type SessionSummaryWorkOrderFieldPolicy = {
	isFailed?: FieldPolicy<any> | FieldReadFunction<any>,
	isSold?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	paidShares?: FieldPolicy<any> | FieldReadFunction<any>,
	unpaidShares?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionUpdateKeySpecifier = ('data' | 'eventDate' | 'eventName' | 'sessionId' | SessionUpdateKeySpecifier)[];
export type SessionUpdateFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	eventDate?: FieldPolicy<any> | FieldReadFunction<any>,
	eventName?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SessionUserKeySpecifier = ('captainId' | 'createdAt' | 'isPilot' | 'loadout' | 'owner' | 'ownerId' | 'sessionId' | 'sessionRole' | 'shipName' | 'shipRole' | 'state' | 'updatedAt' | 'vehicleCode' | SessionUserKeySpecifier)[];
export type SessionUserFieldPolicy = {
	captainId?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	isPilot?: FieldPolicy<any> | FieldReadFunction<any>,
	loadout?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionRole?: FieldPolicy<any> | FieldReadFunction<any>,
	shipName?: FieldPolicy<any> | FieldReadFunction<any>,
	shipRole?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicleCode?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipClusterFindKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'gravityWell' | 'includeInSurvey' | 'note' | 'owner' | 'ownerId' | 'rawScore' | 'score' | 'scoutingFindId' | 'sessionId' | 'shipRocks' | 'state' | 'surveyBonus' | 'updatedAt' | 'version' | ShipClusterFindKeySpecifier)[];
export type ShipClusterFindFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	gravityWell?: FieldPolicy<any> | FieldReadFunction<any>,
	includeInSurvey?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	rawScore?: FieldPolicy<any> | FieldReadFunction<any>,
	score?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shipRocks?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyBonus?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipMiningOrderKeySpecifier = ('createdAt' | 'crewShares' | 'expenses' | 'failReason' | 'includeTransferFee' | 'isRefined' | 'isSold' | 'method' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'processDurationS' | 'processEndTime' | 'processStartTime' | 'refinery' | 'sellStore' | 'seller' | 'sellerUserId' | 'sellerscName' | 'session' | 'sessionId' | 'shareAmount' | 'shareRefinedValue' | 'shipOres' | 'state' | 'updatedAt' | 'version' | ShipMiningOrderKeySpecifier)[];
export type ShipMiningOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefined?: FieldPolicy<any> | FieldReadFunction<any>,
	isSold?: FieldPolicy<any> | FieldReadFunction<any>,
	method?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	processDurationS?: FieldPolicy<any> | FieldReadFunction<any>,
	processEndTime?: FieldPolicy<any> | FieldReadFunction<any>,
	processStartTime?: FieldPolicy<any> | FieldReadFunction<any>,
	refinery?: FieldPolicy<any> | FieldReadFunction<any>,
	sellStore?: FieldPolicy<any> | FieldReadFunction<any>,
	seller?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerscName?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	shareRefinedValue?: FieldPolicy<any> | FieldReadFunction<any>,
	shipOres?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipMiningOrderCaptureKeySpecifier = ('expenses' | 'method' | 'processDurationS' | 'refinery' | 'shipOres' | ShipMiningOrderCaptureKeySpecifier)[];
export type ShipMiningOrderCaptureFieldPolicy = {
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	method?: FieldPolicy<any> | FieldReadFunction<any>,
	processDurationS?: FieldPolicy<any> | FieldReadFunction<any>,
	refinery?: FieldPolicy<any> | FieldReadFunction<any>,
	shipOres?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipRockKeySpecifier = ('inst' | 'mass' | 'ores' | 'res' | 'rockType' | 'state' | ShipRockKeySpecifier)[];
export type ShipRockFieldPolicy = {
	inst?: FieldPolicy<any> | FieldReadFunction<any>,
	mass?: FieldPolicy<any> | FieldReadFunction<any>,
	ores?: FieldPolicy<any> | FieldReadFunction<any>,
	res?: FieldPolicy<any> | FieldReadFunction<any>,
	rockType?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ShipRockCaptureKeySpecifier = ('inst' | 'mass' | 'ores' | 'res' | 'rockType' | ShipRockCaptureKeySpecifier)[];
export type ShipRockCaptureFieldPolicy = {
	inst?: FieldPolicy<any> | FieldReadFunction<any>,
	mass?: FieldPolicy<any> | FieldReadFunction<any>,
	ores?: FieldPolicy<any> | FieldReadFunction<any>,
	res?: FieldPolicy<any> | FieldReadFunction<any>,
	rockType?: FieldPolicy<any> | FieldReadFunction<any>
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
export type SurveyDataKeySpecifier = ('data' | 'dataName' | 'epoch' | 'lastUpdated' | SurveyDataKeySpecifier)[];
export type SurveyDataFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	dataName?: FieldPolicy<any> | FieldReadFunction<any>,
	epoch?: FieldPolicy<any> | FieldReadFunction<any>,
	lastUpdated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UEXLookupsKeySpecifier = ('bodies' | 'maxPrices' | 'ships' | 'tradeports' | UEXLookupsKeySpecifier)[];
export type UEXLookupsFieldPolicy = {
	bodies?: FieldPolicy<any> | FieldReadFunction<any>,
	maxPrices?: FieldPolicy<any> | FieldReadFunction<any>,
	ships?: FieldPolicy<any> | FieldReadFunction<any>,
	tradeports?: FieldPolicy<any> | FieldReadFunction<any>
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
export type UserProfileKeySpecifier = ('apiKey' | 'avatarUrl' | 'createdAt' | 'deliveryShipCode' | 'discordGuilds' | 'friends' | 'isSurveyor' | 'isSurveyorBanned' | 'joinedSessions' | 'lastActive' | 'loadouts' | 'mySessions' | 'plan' | 'scName' | 'sessionSettings' | 'sessionShipCode' | 'state' | 'surveyorGuild' | 'surveyorName' | 'surveyorScore' | 'updatedAt' | 'userId' | 'userSettings' | 'verifyCode' | 'workOrders' | UserProfileKeySpecifier)[];
export type UserProfileFieldPolicy = {
	apiKey?: FieldPolicy<any> | FieldReadFunction<any>,
	avatarUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	deliveryShipCode?: FieldPolicy<any> | FieldReadFunction<any>,
	discordGuilds?: FieldPolicy<any> | FieldReadFunction<any>,
	friends?: FieldPolicy<any> | FieldReadFunction<any>,
	isSurveyor?: FieldPolicy<any> | FieldReadFunction<any>,
	isSurveyorBanned?: FieldPolicy<any> | FieldReadFunction<any>,
	joinedSessions?: FieldPolicy<any> | FieldReadFunction<any>,
	lastActive?: FieldPolicy<any> | FieldReadFunction<any>,
	loadouts?: FieldPolicy<any> | FieldReadFunction<any>,
	mySessions?: FieldPolicy<any> | FieldReadFunction<any>,
	plan?: FieldPolicy<any> | FieldReadFunction<any>,
	scName?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionShipCode?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyorGuild?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyorName?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyorScore?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>,
	userSettings?: FieldPolicy<any> | FieldReadFunction<any>,
	verifyCode?: FieldPolicy<any> | FieldReadFunction<any>,
	workOrders?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleKeySpecifier = ('UEXID' | 'cargo' | 'maker' | 'miningHold' | 'name' | 'role' | VehicleKeySpecifier)[];
export type VehicleFieldPolicy = {
	UEXID?: FieldPolicy<any> | FieldReadFunction<any>,
	cargo?: FieldPolicy<any> | FieldReadFunction<any>,
	maker?: FieldPolicy<any> | FieldReadFunction<any>,
	miningHold?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	role?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleClusterFindKeySpecifier = ('attendance' | 'attendanceIds' | 'clusterCount' | 'clusterType' | 'createdAt' | 'gravityWell' | 'includeInSurvey' | 'note' | 'owner' | 'ownerId' | 'rawScore' | 'score' | 'scoutingFindId' | 'sessionId' | 'state' | 'surveyBonus' | 'updatedAt' | 'vehicleRocks' | 'version' | VehicleClusterFindKeySpecifier)[];
export type VehicleClusterFindFieldPolicy = {
	attendance?: FieldPolicy<any> | FieldReadFunction<any>,
	attendanceIds?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterCount?: FieldPolicy<any> | FieldReadFunction<any>,
	clusterType?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	gravityWell?: FieldPolicy<any> | FieldReadFunction<any>,
	includeInSurvey?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	rawScore?: FieldPolicy<any> | FieldReadFunction<any>,
	score?: FieldPolicy<any> | FieldReadFunction<any>,
	scoutingFindId?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	surveyBonus?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicleRocks?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleMiningOrderKeySpecifier = ('createdAt' | 'crewShares' | 'expenses' | 'failReason' | 'includeTransferFee' | 'isSold' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'sellStore' | 'seller' | 'sellerUserId' | 'sellerscName' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | 'vehicleOres' | 'version' | VehicleMiningOrderKeySpecifier)[];
export type VehicleMiningOrderFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isSold?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellStore?: FieldPolicy<any> | FieldReadFunction<any>,
	seller?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerscName?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicleOres?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleMiningRowKeySpecifier = ('amt' | 'ore' | VehicleMiningRowKeySpecifier)[];
export type VehicleMiningRowFieldPolicy = {
	amt?: FieldPolicy<any> | FieldReadFunction<any>,
	ore?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleRockKeySpecifier = ('inst' | 'mass' | 'ores' | 'res' | VehicleRockKeySpecifier)[];
export type VehicleRockFieldPolicy = {
	inst?: FieldPolicy<any> | FieldReadFunction<any>,
	mass?: FieldPolicy<any> | FieldReadFunction<any>,
	ores?: FieldPolicy<any> | FieldReadFunction<any>,
	res?: FieldPolicy<any> | FieldReadFunction<any>
};
export type VehicleRockOreKeySpecifier = ('ore' | 'percent' | VehicleRockOreKeySpecifier)[];
export type VehicleRockOreFieldPolicy = {
	ore?: FieldPolicy<any> | FieldReadFunction<any>,
	percent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WorkOrderDefaultsKeySpecifier = ('crewShares' | 'includeTransferFee' | 'isRefined' | 'lockedFields' | 'method' | 'refinery' | 'salvageOres' | 'sellStores' | 'shareRefinedValue' | 'shipOres' | 'vehicleOres' | WorkOrderDefaultsKeySpecifier)[];
export type WorkOrderDefaultsFieldPolicy = {
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isRefined?: FieldPolicy<any> | FieldReadFunction<any>,
	lockedFields?: FieldPolicy<any> | FieldReadFunction<any>,
	method?: FieldPolicy<any> | FieldReadFunction<any>,
	refinery?: FieldPolicy<any> | FieldReadFunction<any>,
	salvageOres?: FieldPolicy<any> | FieldReadFunction<any>,
	sellStores?: FieldPolicy<any> | FieldReadFunction<any>,
	shareRefinedValue?: FieldPolicy<any> | FieldReadFunction<any>,
	shipOres?: FieldPolicy<any> | FieldReadFunction<any>,
	vehicleOres?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WorkOrderExpenseKeySpecifier = ('amount' | 'name' | 'ownerScName' | WorkOrderExpenseKeySpecifier)[];
export type WorkOrderExpenseFieldPolicy = {
	amount?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerScName?: FieldPolicy<any> | FieldReadFunction<any>
};
export type WorkOrderInterfaceKeySpecifier = ('createdAt' | 'crewShares' | 'expenses' | 'failReason' | 'includeTransferFee' | 'isSold' | 'note' | 'orderId' | 'orderType' | 'owner' | 'ownerId' | 'sellStore' | 'seller' | 'sellerUserId' | 'sellerscName' | 'session' | 'sessionId' | 'shareAmount' | 'state' | 'updatedAt' | 'version' | WorkOrderInterfaceKeySpecifier)[];
export type WorkOrderInterfaceFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	crewShares?: FieldPolicy<any> | FieldReadFunction<any>,
	expenses?: FieldPolicy<any> | FieldReadFunction<any>,
	failReason?: FieldPolicy<any> | FieldReadFunction<any>,
	includeTransferFee?: FieldPolicy<any> | FieldReadFunction<any>,
	isSold?: FieldPolicy<any> | FieldReadFunction<any>,
	note?: FieldPolicy<any> | FieldReadFunction<any>,
	orderId?: FieldPolicy<any> | FieldReadFunction<any>,
	orderType?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	ownerId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellStore?: FieldPolicy<any> | FieldReadFunction<any>,
	seller?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerUserId?: FieldPolicy<any> | FieldReadFunction<any>,
	sellerscName?: FieldPolicy<any> | FieldReadFunction<any>,
	session?: FieldPolicy<any> | FieldReadFunction<any>,
	sessionId?: FieldPolicy<any> | FieldReadFunction<any>,
	shareAmount?: FieldPolicy<any> | FieldReadFunction<any>,
	state?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>,
	version?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	APIEvent?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | APIEventKeySpecifier | (() => undefined | APIEventKeySpecifier),
		fields?: APIEventFieldPolicy,
	},
	ActiveMiningLaserLoadout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ActiveMiningLaserLoadoutKeySpecifier | (() => undefined | ActiveMiningLaserLoadoutKeySpecifier),
		fields?: ActiveMiningLaserLoadoutFieldPolicy,
	},
	CIGLookups?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CIGLookupsKeySpecifier | (() => undefined | CIGLookupsKeySpecifier),
		fields?: CIGLookupsFieldPolicy,
	},
	CrewShare?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CrewShareKeySpecifier | (() => undefined | CrewShareKeySpecifier),
		fields?: CrewShareFieldPolicy,
	},
	CrewShareTemplate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CrewShareTemplateKeySpecifier | (() => undefined | CrewShareTemplateKeySpecifier),
		fields?: CrewShareTemplateFieldPolicy,
	},
	DiscordGuild?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DiscordGuildKeySpecifier | (() => undefined | DiscordGuildKeySpecifier),
		fields?: DiscordGuildFieldPolicy,
	},
	DiscordGuildInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DiscordGuildInterfaceKeySpecifier | (() => undefined | DiscordGuildInterfaceKeySpecifier),
		fields?: DiscordGuildInterfaceFieldPolicy,
	},
	LookupData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LookupDataKeySpecifier | (() => undefined | LookupDataKeySpecifier),
		fields?: LookupDataFieldPolicy,
	},
	MiningLoadout?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MiningLoadoutKeySpecifier | (() => undefined | MiningLoadoutKeySpecifier),
		fields?: MiningLoadoutFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	MyDiscordGuild?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MyDiscordGuildKeySpecifier | (() => undefined | MyDiscordGuildKeySpecifier),
		fields?: MyDiscordGuildFieldPolicy,
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
	PendingUser?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PendingUserKeySpecifier | (() => undefined | PendingUserKeySpecifier),
		fields?: PendingUserFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	RefineryRow?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefineryRowKeySpecifier | (() => undefined | RefineryRowKeySpecifier),
		fields?: RefineryRowFieldPolicy,
	},
	RefineryRowCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RefineryRowCaptureKeySpecifier | (() => undefined | RefineryRowCaptureKeySpecifier),
		fields?: RefineryRowCaptureFieldPolicy,
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
	SalvageWreckOre?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SalvageWreckOreKeySpecifier | (() => undefined | SalvageWreckOreKeySpecifier),
		fields?: SalvageWreckOreFieldPolicy,
	},
	ScoutingFindInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ScoutingFindInterfaceKeySpecifier | (() => undefined | ScoutingFindInterfaceKeySpecifier),
		fields?: ScoutingFindInterfaceFieldPolicy,
	},
	SellStores?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SellStoresKeySpecifier | (() => undefined | SellStoresKeySpecifier),
		fields?: SellStoresFieldPolicy,
	},
	Session?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionKeySpecifier | (() => undefined | SessionKeySpecifier),
		fields?: SessionFieldPolicy,
	},
	SessionSettings?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionSettingsKeySpecifier | (() => undefined | SessionSettingsKeySpecifier),
		fields?: SessionSettingsFieldPolicy,
	},
	SessionShare?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionShareKeySpecifier | (() => undefined | SessionShareKeySpecifier),
		fields?: SessionShareFieldPolicy,
	},
	SessionSummary?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionSummaryKeySpecifier | (() => undefined | SessionSummaryKeySpecifier),
		fields?: SessionSummaryFieldPolicy,
	},
	SessionSummaryTotals?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionSummaryTotalsKeySpecifier | (() => undefined | SessionSummaryTotalsKeySpecifier),
		fields?: SessionSummaryTotalsFieldPolicy,
	},
	SessionSummaryWorkOrder?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionSummaryWorkOrderKeySpecifier | (() => undefined | SessionSummaryWorkOrderKeySpecifier),
		fields?: SessionSummaryWorkOrderFieldPolicy,
	},
	SessionUpdate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SessionUpdateKeySpecifier | (() => undefined | SessionUpdateKeySpecifier),
		fields?: SessionUpdateFieldPolicy,
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
	ShipMiningOrderCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipMiningOrderCaptureKeySpecifier | (() => undefined | ShipMiningOrderCaptureKeySpecifier),
		fields?: ShipMiningOrderCaptureFieldPolicy,
	},
	ShipRock?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipRockKeySpecifier | (() => undefined | ShipRockKeySpecifier),
		fields?: ShipRockFieldPolicy,
	},
	ShipRockCapture?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipRockCaptureKeySpecifier | (() => undefined | ShipRockCaptureKeySpecifier),
		fields?: ShipRockCaptureFieldPolicy,
	},
	ShipRockOre?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ShipRockOreKeySpecifier | (() => undefined | ShipRockOreKeySpecifier),
		fields?: ShipRockOreFieldPolicy,
	},
	Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier),
		fields?: SubscriptionFieldPolicy,
	},
	SurveyData?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SurveyDataKeySpecifier | (() => undefined | SurveyDataKeySpecifier),
		fields?: SurveyDataFieldPolicy,
	},
	UEXLookups?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UEXLookupsKeySpecifier | (() => undefined | UEXLookupsKeySpecifier),
		fields?: UEXLookupsFieldPolicy,
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
	Vehicle?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | VehicleKeySpecifier | (() => undefined | VehicleKeySpecifier),
		fields?: VehicleFieldPolicy,
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