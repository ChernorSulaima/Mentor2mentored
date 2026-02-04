import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { acceptFriendRequest, getFriendRequests } from '../lib/api';
import { ClockIcon, MapPinIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react';
import { getCountryFlag } from '../components/UserCard';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const {data: friendRequests, isLoading} = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests
  })

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    }
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];
 
  console.log(acceptedRequests)

  return (
    <div className='space-y-11 h-[97vh] overflow-y-scroll'>
      <div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className='space-y-12'>
            {incomingRequests.length > 0 && (
              <section>
                 <h3 className="flexStart gap-2 mb-6">
                  <UserCheckIcon className="text-primary" />
                  Connection Requests
                  <span className="badge badge-primary badge-xs relative bottom-2">{incomingRequests.length}</span>
                </h3>
                <div className='space-y-3 max-w-md'>
                  {incomingRequests.map((request) => (
                     <div
                      key={request._id}
                      className="card bg-base-100 card-sm"
                    >
                      <div className="card-body">
                        <div>
                          <div className="flexBetween mb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <img src={request.sender.image} alt={request.sender.fullName} width={55} />
                              <div>
                                <h5 className="capitalize">{request.sender.fullName}</h5>
                                {request.sender.location && (
                                  <p className="para flex items-center gap-2 mt-1">
                                    <MapPinIcon className="size-4" />
                                    {request.sender.location}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button onClick={() => acceptRequestMutation(request._id)}
                              disabled={isPending} className="btn btn-info btn-soft btn-xs">
                              Accept
                            </button>
                          </div>
                          <p className="para">{request.sender.bio}</p>
                        </div>
                        <hr className="h-px w-full bg-base-content opacity-10 rounded-full border-none mb-2" />
                        <div className="flex gap-1 sm:gap-3">
                          <span className="badge badge-soft badge-secondary text-xs capitalize">
                            {getCountryFlag(request.sender.language)}
                            {request.sender.language}
                          </span>
                          <span className="badge badge-soft badge-success text-xs capitalize">
                            <span className="hidden sm:block">Skill:</span>
                            {request.sender.skill}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
                <section>
                  <h3 className="flexStart gap-2 mb-6">
                    <UserCheckIcon className="text-primary" />
                    Connection Requests
                    <span className="badge badge-primary badge-xs relative bottom-2">{acceptedRequests.length}</span>
                  </h3>
                  <div className='space-y-3 max-w-md'>
                    {acceptedRequests.map((request) => (
                      <div key={request._id}
                        className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                          <div>
                            <div className="flexBetween mb-3">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <img src={request.recipient.image} alt={request.recipient.fullName} width={55} />
                                <div>
                                  <h5 className="capitalize">{request.recipient.fullName}</h5>
                                  <p className="para">accepted your friend request</p>
                                  <p className="text-xs flex items-center opacity-70">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    Recently
                                  </p>
                                </div>
                              </div>
                              <button
                                className="badge badge-info badge-soft text-xs">
                                <MessageSquareIcon className="h-3 w-3 mr-1" />
                                New Friend
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage