/* import { takeLatest, call, put, select, take, race, cancelled } from "redux-saga/effects";
import locationService from "../../services/locationService";
import {
    START_RIDE_FLOW_REQUEST,
    startRideFlowSuccess,
    LOAD_START_RIDE_FLOW_DATA,
} from "../actions/startRideFlowAction";

import {
    getSubStatusRequest,
    getAvailableCustomerSubRequest,
    getSubPackagesRequest,
} from "../actions/subscriptionAction";
import { getSettingsRequest, getProvisionAmountRequest } from "../actions/generalAction";
import { checkDebtRequest } from "../actions/debtAction";
import { definePayment, definePaymentState } from "../slices/walletSlice";
import { getLocation } from "../slices/locationSlice";
import {
    createMpTransactionIdRequest,
    createTripRequest,
    getActiveTripRequest,
} from "../actions/scooterRideAction";
import { clearScooterRide } from "../slices/scooterRideSlice";
import { clearSubData } from "../slices/subscriptionSlice";
import { clearGeneralData } from "../slices/generalSlice";
import { resetTimer, startTimer } from "../slices/timerSlice";
import { clearDebt } from "../slices/debtSlice";
;
import { start as startRideFlow, success, failure, reset as resetRideFlow, failure_type } from "../slices/startRideFlowSlice";
import { getCustomerCardsRequest } from "../actions/cardAction";
import { showModal, hideModal } from "../slices/modalSlice";
import { lang } from "../../i18n/lang";
import { getTerritoryIdRequest } from "../actions/authAction";
import { hideLoading, showLoading } from "../slices/loadingSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SagaIterator } from "redux-saga";
import subscriptionSaga from "./subscriptionSaga";
import { getWalletDetailsRequest } from "../actions/walletAction";
import { getLastContractRequest } from "../actions/supportAction";

// Selectors (adjust paths/keys to your actual state shape)
const selectAuth = (state: any) => state.auth;
const selectGeneral = (state: any) => state.general;
const selectWallet = (state: any) => state.wallet;
const selectSubscription = (state: any) => state.subscription;
const selectLocation = (state: any) => state.location;
const selectScooterRide = (state: any) => state.scooterRide;
const selectCard = (state: any) => state.card;
const selectScooter = (state: any) => state.scooter;
const selectSupport = (state: any) => state.support;

let paymentState: string = "";

function* waitForAction(successType: string, failureType?: string) {
    if (failureType) {
        const { success, failure } = yield race({
            success: take(successType),
            failure: take(failureType),
        });
        if (failure) throw new Error(`${failureType} received`);
        return success;
    } else {
        yield take(successType);
    }
}

function* distanceCheck(data: any, settings: any) {
    const { scooterList } = yield select(selectScooter);
    if (!scooterList || !data) {
        console.error("Missing scooter list or data for distance check");
        throw new Error(lang('birsorunolustu'));
    }

    const scooterItem = scooterList.find((item: any) => item.id === data.id);
    if (!scooterItem) {
        throw new Error(lang('scooterbulunamadi'));
    }

    // Get current coords
    //const coords = await locationService.getCurrentPosition();
    //const coords = { latitude: 40.36287, longitude: 28.92178};

    const coords: { latitude: number; longitude: number } = yield call(
        [locationService, locationService.getCurrentPosition]
    );

    yield put(getLocation(coords));
    if (!coords) throw new Error(lang('konumhatasi'));

    //get territoryId here

    if (coords !== null && coords !== undefined) {
        yield put(getTerritoryIdRequest({ lat: coords.latitude.toString(), lng: coords.longitude.toString() }));
        yield take("auth/getTerritoryId");
        //const {territoryId } = yield select(selectAuth);
    }

    // Haversine-like distance, replicate calcCrow logic or outsource
    const calcCrow = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // km
        const toRad = (v: number) => (v * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const scooterLat = scooterItem.ScooterActual?.lat ?? scooterItem.ScooterActual?.Scooter?.lat;
    const scooterLng = scooterItem.ScooterActual?.lng ?? scooterItem.ScooterActual?.Scooter?.lng;
    const distanceKm = calcCrow(scooterLat, scooterLng, coords.latitude, coords.longitude);
    const distanceMeters = Math.round(distanceKm * 1000 * 1000) / 1000; // keeping same rounding logic

    console.log("settings value: ", settings.value)

    const thresholdMeters = parseInt((settings.value * 1000).toString(), 10);

    if (distanceMeters > thresholdMeters) {
        console.error(lang('kiralamakicinYakin'));
        throw new Error(lang('kiralamakicinYakin'));
    }

    return true;
}

function* handleStartRideFlow(action: any): Generator<any, void, any> {
    const cancelToken = yield race({
        task: call(function* () {
            try {

                yield put(startRideFlow());

                const { data, isTariff, tariff } = action.payload;

                console.log("clear data")

                // Reset relevant state (mirrors your initial useEffect)
                yield put(clearScooterRide());
                // yield put(clearSubData()); // sonradan eklendi
                yield put(clearGeneralData());
                yield put(clearDebt());
                yield put(resetTimer());

                const { user, customerId, territoryId } = yield select(selectAuth);
                const { deviceId } = yield select(selectGeneral);
                const { defPayment } = yield select(selectWallet);
                //const { subStatus, availableCustomerSub } = yield select(selectSubscription);
                //const { location } = yield select(selectLocation);
                //const { customerCards } = yield select(selectCard);
                //const { tripId, activeTrip } = yield select(selectScooterRide);

                paymentState = defPayment;
                //yield put(definePaymentState(defPayment));

                console.log("debt check");

                yield put(checkDebtRequest({ customerId: customerId }));
                yield take("debt/checkDebt");
                const debtState: any = yield select((s: any) => s.debt);

                if (debtState.debtData) {
                    //throw new Error("USER_HAS_DEBT");
                    yield put(failure(debtState.debtData || "USER_HAS_DEBT"));
                    yield put(failure_type("USER_HAS_DEBT"));
                    throw new Error("USER_HAS_DEBT");
                }

                console.log("getSubStatusRequest")
                yield put(getSubStatusRequest()); // abonelik var mı
                yield take("subscription/setSubStatus");
                const { subStatus } = yield select(selectSubscription);

                if (subStatus) {
                    console.log("getSubStatusRequest 2")
                    // 2.a available customer sub
                    let hasAvailableSub = false;
                    try {
                        yield put(
                            getAvailableCustomerSubRequest(
                                {
                                    customerId: customerId,
                                    territoryId: territoryId
                                }
                            )
                        );
                        // wait for availableCustomerSub to resolve / update in state
                        //yield delay(100); // replace with take if you have explicit success/failure action
                        yield take("subscription/getAvailableCustomerSub");

                        const { availableCustomerSub } = yield select(selectSubscription);

                        console.log("getSubStatusRequest 3 availableCustomerSub. ", availableCustomerSub)

                        if (availableCustomerSub != null) {
                            hasAvailableSub = true;
                            console.log("getSubStatusRequest 4")
                        }
                    } catch {
                        // fallback
                        console.error("abonelik çekilirken hata")
                    }

                    if (hasAvailableSub) {
                        console.log("getSubStatusRequest 5")
                        console.log("yes abone")
                        //yield put(definePayment("Abone"));
                        paymentState = "Abone";
                        //yield put(definePaymentState("Abone"));
                    }
                }

                console.log("def payment 1")
                yield put(definePaymentState(paymentState));
                //yield put(definePayment(paymentState));
                console.log("def payment 2")
                //yield take("wallet/definePaymentState");
                const { defPaymentState } = yield select(selectWallet);

                console.log("def payment 3: ", defPaymentState)

                console.log("getSettingsRequest")
                // 3. Settings
                yield put(getSettingsRequest());
                yield take("general/getSettings");

                const { settings } = yield select(selectGeneral);

                console.log("settings: ", settings)

                // 4. Distance check
                yield call(distanceCheck, data, settings);
                const { location } = yield select(selectLocation);
                console.log("getProvisionAmountRequest")

                const territoryIdNew: any = yield select((s: any) => s.auth.territoryId);
                console.log("territoryIdNew: ", territoryIdNew);

                // 5. Provision amount + Mp transaction id
                yield put(getProvisionAmountRequest({ territoryId: territoryIdNew }));
                //yield delay(100);
                yield take("general/getProvisionAmount");
                const { provisionAmount } = yield select(selectGeneral);
                console.log("provisionAmount: ", provisionAmount);

                console.log("createMpTransactionIdRequest")
                yield put(
                    createMpTransactionIdRequest({ tripType: 0 })
                );

                const { tripIdSuccess, tripIdFailure } = yield race({
                    success: take("scooterRide/createMpTransactionId"),
                    failure: take("scooterRide/setErrorMessage"),
                });

                if (tripIdFailure) {
                    console.error("Trip id failed:", tripIdFailure.payload);
                    yield put(failure(tripIdFailure.payload || "TRIP_ID_ERROR"));
                    throw new Error("TRIP_ID_ERROR");
                }

                const tripId: string = yield select((s: any) => s.scooterRide.tripId);
                if (!tripId || !deviceId || !data) {
                    //throw new Error("Missing required info for trip creation");
                    yield put(failure("Missing required info for trip creation"));
                    throw new Error("TRIP_ID_ERROR");
                }

                const { contractId } = yield select(selectSupport);

                let tripData: any = {};

                if (isTariff === false) {
                    // 6. Build trip payload
                    tripData = {
                        deviceId,
                        organizationId: data.organizationId,
                        territoryId: data.territoryId,
                        customerId: customerId,
                        ClientToken: "",
                        lat: location.latitude,
                        lng: location.longitude,
                        ReferanceNo: Math.floor(Math.random() * 1000000000).toString(),
                        OrderNo: tripId,
                        scooterId: data.id,
                        cardName: defPaymentState,
                        PaymentType: defPaymentState === "Cüzdan ile ödeme" ? 1 : defPaymentState === "Abone" ? 2 : null,
                        Scooter: {
                            name: data.name,
                        },
                        contractVersionTrackingId: contractId
                    };

                    if (defPaymentState !== "Cüzdan ile ödeme" && defPaymentState !== "Abone" && provisionAmount !== 0 && provisionAmount !== '0') {

                        yield put(getCustomerCardsRequest({ territoryId: territoryIdNew, customerId: customerId }));

                        yield take("card/getCustomerCards");

                        const customerCards: any[] = yield select((s: any) => s.card.customerCards);

                        const selectedCard = (customerCards || []).find(
                            (c: any) => c.cardMasked === defPaymentState
                        );
                        if (selectedCard) tripData.creditCardId = selectedCard.id;
                    }

                } else {

                    tripData = {
                        deviceId,
                        organizationId: data.organizationId,
                        territoryId: data.territoryId,
                        customerId: customerId,
                        ClientToken: "",
                        lat: location.latitude,
                        lng: location.longitude,
                        ReferanceNo: Math.floor(Math.random() * 1000000000).toString(),
                        OrderNo: tripId,
                        scooterId: data.id,
                        cardName: defPaymentState,
                        PaymentType: 3,
                        Scooter: {
                            name: data.name,
                        },
                        contractVersionTrackingId: contractId,
                        subscriptionId: tariff.subscriptionId,
                        CreditCardId: tariff.creditCardId
                    };

                }

                console.warn("trip data : ", JSON.stringify(tripData))
                console.log("trip data : defpayment", defPayment)
                console.log("trip data : defPaymentState", defPaymentState)

                console.log("createTripRequest")

                // 7. Create trip
                yield put(createTripRequest({ data: tripData }));

                // wait until either success or failure happens
                const { createTripSuccess, createTripFailure } = yield race({
                    createTripSuccess: take("scooterRide/createTrip"),
                    createTripFailure: take("scooterRide/setErrorMessage"),
                });

                if (createTripFailure) {
                    console.error("Trip creation failed:", createTripFailure.payload);
                    yield put(failure(createTripFailure.payload || "CREATE_TRIP_ERROR"));
                    throw new Error("CREATE_TRIP_ERROR");
                }

                console.log("getActiveTripRequest 1")

                //fetch availablesub for tariff case
                if (isTariff) {
                    yield put(getSubStatusRequest()); // abonelik var mı/tarife alındı mı
                    yield take("subscription/setSubStatus");
                    const { subStatus } = yield select(selectSubscription);

                    if (subStatus) {
                        try {
                            yield put(
                                getAvailableCustomerSubRequest(
                                    {
                                        customerId: customerId,
                                        territoryId: territoryId
                                    }
                                )
                            );
                            yield take("subscription/getAvailableCustomerSub");

                        } catch {
                            // fallback
                            console.error("abonelik çekilirken hata")
                        }
                    }
                }

                // 8. Fetch active trip
                yield put(getActiveTripRequest({ customerId: customerId }));
                //yield delay(100); // wait for active trip to populate
                yield take("scooterRide/setActiveTrip");

                const activeTrip: any = yield select((s: any) => s.scooterRide.activeTrip);
                if (activeTrip?.startTime) {
                    //yield put(startTimer(activeTrip.startTime));
                    //start(activeTrip.startTime); //perform this in startRideModal
                    yield put(success());

                    // Success
                    yield put(startRideFlowSuccess({ activeTrip }));
                }

            } catch (err: any) {
                //yield put(failure(err.message || "Unknown error"));
                console.error("başlatırken hata catch 1")

                let errorMessage = "Unknown error in start ride flow";

                if (err.message === "USER_HAS_DEBT") {
                    console.error("USER_HAS_DEBT")

                } else if (err.message === "TRIP_ID_ERROR") {
                    errorMessage = "TRIP_ID_ERROR";
                } else if (err.message === "CREATE_TRIP_ERROR") {
                    console.error("CREATE_TRIP_ERROR")

                } else {
                    yield put(failure(err.message || "Unknown error"));
                }

                //yield put(failure(errorMessage));

                err.customMessage = "handleStartRideFlow failed";
                throw err;
            }
            finally {
                console.log("in finally")
                if (yield cancelled()) {
                    // optional: dispatch cancellation-specific cleanup
                    yield put(resetRideFlow());
                    console.log("in resetrideflow")
                }
            }
        }),

        cancel: take("scooterRide/startRideFlowCancel"),
    });

    if (cancelToken.cancel) {
        // if cancellation happened, you could optionally dispatch failure/cancel action
        yield put(failure("Ride flow cancelled"));
    }
}

function* loadStartRideFlowData(): SagaIterator {

    try {
        yield put(showLoading());

        console.log("loadStartRideFlowData started")

        const { customerId, territoryId } = yield select(selectAuth);

        yield put(getSubPackagesRequest({ territoryId: territoryId, type: 3 }));
        //yield take("subscription/subPackages");

        console.log("loadStartRideFlowData 1")

        yield put(getCustomerCardsRequest({ territoryId: territoryId, customerId: customerId }));
        //yield take("card/getCustomerCards");

        yield put(getWalletDetailsRequest({ customerId: customerId, territoryId: territoryId }));

        console.log("loadStartRideFlowData 2")

        yield put(getSubStatusRequest()); // abonelik var mı
        yield take("subscription/setSubStatus");

        const { subStatus } = yield select(selectSubscription);

        if (subStatus) {
            try {
                yield put(
                    getAvailableCustomerSubRequest(
                        {
                            customerId: customerId,
                            territoryId: territoryId
                        }
                    )
                );
                //yield take("subscription/getAvailableCustomerSub");

            } catch {
                // fallback
                console.error("abonelik çekilirken hata")
            }
        }

        yield put(getLastContractRequest());

        console.log("loadStartRideFlowData finish")

    } finally {
        console.log("loadStartRideFlowData finally")
        yield put(hideLoading());
    }

}

export default function* watchStartRideFlow() {
    yield takeLatest(START_RIDE_FLOW_REQUEST, handleStartRideFlow);
    yield takeLatest(LOAD_START_RIDE_FLOW_DATA, loadStartRideFlowData);
}
 */