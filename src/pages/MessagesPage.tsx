import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  if (!user) {
    return <div>Not authenticated</div>;
  }

  const allMessages = db.getMessages(user.id);
  
  // Get unique conversations
  const conversationUserIds = new Set<string>();
  allMessages.forEach((msg) => {
    if (msg.sender_id === user.id) {
      conversationUserIds.add(msg.receiver_id);
    } else {
      conversationUserIds.add(msg.sender_id);
    }
  });

  const conversations = Array.from(conversationUserIds)
    .map((userId) => ({
      userId,
      user: db.getUser(userId),
      messages: db.getConversation(user.id, userId),
    }))
    .sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1]?.timestamp || '';
      const bLast = b.messages[b.messages.length - 1]?.timestamp || '';
      return new Date(bLast).getTime() - new Date(aLast).getTime();
    });

  const selectedConversation = conversations.find((c) => c.userId === selectedUserId);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUserId) return;

    db.addMessage({
      sender_id: user.id,
      receiver_id: selectedUserId,
      message: messageText,
      timestamp: new Date().toISOString(),
    });

    setMessageText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="heading-large mb-2">💬 Messages</h1>
          <p className="text-gray-600">Chat with shop owners and customers</p>
        </div>

        <div className="flex gap-6 h-[600px] max-h-full">
          {/* Conversations List */}
          <div className="w-full sm:w-80 card-base shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
              <h2 className="font-bold text-white">All Conversations</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedUserId(conv.userId)}
                    className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-blue-50 transition ${
                      selectedUserId === conv.userId ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{conv.user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {conv.user?.role === 'shop_owner' ? '🏪 Shop Owner' : '👤 Customer'}
                    </p>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 card-base shadow-md hidden sm:flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-500 to-purple-500">
                  <h2 className="font-bold text-lg text-white">{selectedConversation.user?.name}</h2>
                  <p className="text-sm text-blue-100">
                    {selectedConversation.user?.role === 'shop_owner' ? '🏪 Shop Owner' : '👤 Customer'}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {selectedConversation.messages.length > 0 ? (
                    selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_id === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-3 rounded-2xl ${
                            msg.sender_id === user.id
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No messages yet. Say hello! 👋</p>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4 bg-white flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="input-base flex-1"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="btn-primary px-6 py-2 font-semibold"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div>
                  <div className="text-6xl mb-4">💬</div>
                  <p className="heading-small text-gray-600">Select a conversation</p>
                  <p className="text-gray-500 mt-2">Choose from your conversations to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
