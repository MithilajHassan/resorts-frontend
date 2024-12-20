import { useEffect, useState } from 'react';
import UserHeader from '../../components/users/UserHeader'
import { useGetReceiversMutation } from '../../slices/userApiSlice';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const MessagePage: React.FC = () => {

    const [rececivers, setReceivers] = useState<{ id: string, name: string }[]>()
    const [getReceivers] = useGetReceiversMutation()

    useEffect(() => {
        (async function () {
            try {
                const res = await getReceivers().unwrap()
                const transformedReceivers = res.map((conversation) => {
                    const resort = conversation.participants.find(
                        (participant) => participant.participantType === 'Resort'
                    );
                    return {
                        id: conversation._id!,
                        name: typeof resort!.participantId !== 'string' && 'resortName' in resort!.participantId
                            ? resort!.participantId.resortName : '',
                    };
                });
                setReceivers(transformedReceivers)
            } catch (err) {
            }

        })()
    }, [])

    const messages: Message[] = [
        { id: 1, text: 'Hi there!', sender: 'user' },
        { id: 2, text: 'Hello! How can I help you?', sender: 'bot' },
        { id: 3, text: 'I need some assistance.', sender: 'user' },
        { id: 4, text: 'Sure, tell me more about your issue.', sender: 'bot' },
        { id: 2, text: 'Hello! How can I help you?', sender: 'bot' },
        { id: 3, text: 'I need some assistance.', sender: 'user' },
        { id: 2, text: 'Hello! How can I help you?', sender: 'bot' },
        { id: 3, text: 'I need some assistance.', sender: 'user' },
        { id: 2, text: 'Hello! How can I help you?', sender: 'bot' },
        { id: 3, text: 'I need some assistance.', sender: 'user' },
    ];

    return (
        <>
            <UserHeader />
            <div className="flex h-screen pt-16">
                <aside className="w-1/4 bg-white border-r border-blue-300">

                    <ul className="p-4 space-y-2">
                        {rececivers?.length && rececivers.map((conversation) => (
                            <li
                                key={conversation.id}
                                className="p-2 rounded-lg bg-blue-200 hover:bg-blue-300 cursor-pointer text-blue-800 font-medium"
                            >
                                {conversation.name}
                            </li>
                        ))}
                    </ul>
                </aside>


                <div className="flex-1 flex flex-col">

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`max-w-xs p-3 rounded-lg text-white font-medium shadow-md ${message.sender === 'user'
                                    ? 'bg-blue-700 place-self-end'
                                    : 'bg-blue-500 place-self-start'
                                    }`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>


                    <div className="p-4 bg-blue-100 border-t border-blue-300 flex items-center space-x-2">
                        <input
                            type="text"
                            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none  bg-white text-blue-800 placeholder-blue-600"
                            placeholder="Type a message..."
                        />
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 font-medium"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessagePage;
