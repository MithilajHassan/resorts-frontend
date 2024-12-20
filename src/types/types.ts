import { Location } from "@/components/common/LocationSelecting";

export type CategoryDetails = {
    _id: string;
    name: string;
    isDelete: boolean;
}

export type FacilityDetails = {
    _id: string;
    facilityName: string;
    isDelete: boolean;
}

export interface IResort {
    _id?: string;
    resortName: string;
    email: string;
    password?: string;
    address: string;
    city: string;
    phone: string;
    description: string;
    categories: string[] | CategoryDetails[];
    facilities: string[] | FacilityDetails[];
    images: string[];
    isVerify?: boolean;
    isBlock?: boolean;
    location: Location;
    isRejected?: boolean;
}

export interface IUser {
    _id: string
    name: string,
    email: string,
    phone?: number,
    password: string,
    walletBalance: number,
    avatar?: string,
    role: string,
    isBlock: boolean
}


export interface ApiError {
    status: number;
    data: {
        message: string;
        success?: boolean;
    };
}

export interface IRoom {
    _id?: string;
    resortId: string;
    name: string;
    numberOfGuests: number;
    totalRooms: number;
    normalPrice: number;
    offerPercentage: number;
    offerPrice?: number;
    isDeleted?: boolean;
}

export interface AvailableRoom {
    resort: IResort;
    rooms: IRoom[];
}

export interface SearchRoomsResult {
    availableRooms: AvailableRoom[];
    totalResorts: number;
}


export interface IBooking {
    _id?: string;
    userId: string;
    resortId: IResort | string;
    roomId: IRoom | string;
    guestName: string;
    guestPhone: number;
    guestEmail: string;
    guestCount: number;
    checkInDate: Date;
    checkOutDate: Date;
    checkInTime: string;
    checkOutTime: string;
    totalPrice: number;
    paymentMethod?: string;
    paymentStatus?: boolean;
    status?: string;
    discount?: number;
    transactionId?: string;
}

export interface IReview {
    _id?: string;
    bookingId: string;
    userId: string | { _id: string, name: string, avatar: string };
    resortId: string;
    reviewText: string;
    rating: number;
    reviewDate?: Date;
}

export interface IWishlist {
    _id?: string,
    userId: string;
    resortId: IResort | string;
    createdAt?: Date;
}

export interface IBanner {
    _id?: string,
    title: string;
    imageUrl: string;
    description: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICoupon {
    _id?: string;
    code: string;
    minBooking: number;
    discount: number;
    createdAt?: Date;
    expireAt: Date;
    isDeleted?: boolean;
}

export interface IWalletHistory {
    id?: string,
    userId: string,
    amount: number;
    type: 'Deposit' | 'Purchase' | 'Refund';
    createdAt?: Date;
}


export interface IMessage {
    _id?: string;
    senderId: string;
    senderType: 'User' | 'Resort';
    receiverId: string;
    receiverType: 'User' | 'Resort';
    message: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IConversation {
    _id?: string;
    participants: Array<{ participantId: string | IUser | IResort; participantType: 'User' | 'Resort' }>;
    messages: IMessage[];
    createdAt?: Date;
    updatedAt?: Date;
}