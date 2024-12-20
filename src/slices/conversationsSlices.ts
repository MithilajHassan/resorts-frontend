import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation, IMessage } from '@/types/types'; 

interface ConversationsState {
  conversations: IConversation[];
}

const initialState: ConversationsState = {
  conversations: [],
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<IConversation[]>) {
      state.conversations = action.payload;
    },
    addMessageToConversation( state, action: PayloadAction<{conversationId:string,messageData:IMessage}>) {
      const { conversationId, messageData } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (conversation) {
        conversation.messages.push(messageData);
      }
    },
  },
});

export const { setConversations, addMessageToConversation } = conversationsSlice.actions;

export default conversationsSlice.reducer;
