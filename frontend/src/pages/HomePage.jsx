import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import NoFriendsFound from '../components/NoFriendsFound';
import UserCard from '../components/UserCard';
import NoRecommendationsFound from '../components/NoRecommendationsFound';
import toast from 'react-hot-toast';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());


  const {data: friends = [], isLoading: loadingFriends} = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends
  })

  const {data: recommendedUsers = [], isLoading: loadingUsers} = useQuery({
    queryKey: ['users'],
    queryFn: getRecommendedUsers
  })


  const {data: outgoingFriendReqs} = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendReqs
  })

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
    onError: (error) => toast.error(error.response.data.message),
  });


  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);


  return (
    <div className='space-y-11 h-[97vh] overflow-y-scroll'>
      {/* FRIENDS SECTION */}
       <section>
        <div className='mb-6'>
          <h3>Learning Partners</h3>
          <p className="para">
            Connect and practice skills with your learning partners
          </p>
        </div>
        {loadingFriends ? (
          <div className='flexCenter py-12'>
            <span className='loading loading-spinner loading-lg'/>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {friends.map((user)=>(
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
       </section>

      {/* Recommended Connections SECTION */}
       <section>
        <div className='mb-6'>
          <h3>Expand Your Network</h3>
          <p className="para">
            Meet new learners ready to exchange skills and practice together
          </p>
        </div>
        {loadingUsers ? (
          <div className='flexCenter py-12'>
            <span className='loading loading-spinner loading-lg'/>
          </div>
        ) : recommendedUsers.length === 0 ? (
          <NoRecommendationsFound />
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {recommendedUsers.map((user)=>{
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
              return (
                <UserCard key={user._id} user={user} hasRequestBeenSent={hasRequestBeenSent} sendRequestMutation={sendRequestMutation} isPending={isPending} />
              )}
            )}
          </div>
        )}
       </section>

    </div>
  )
}

export default HomePage