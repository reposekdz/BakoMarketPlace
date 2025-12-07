import { useState, useEffect, useRef } from 'react';
import { Video, Phone, Mic, MicOff, VideoOff, X, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface CallProps {
  callId?: number;
  receiverId: number;
  receiverName: string;
  receiverAvatar: string;
  callType: 'audio' | 'video';
  onEnd: () => void;
}

export function VideoCallInterface({ callId, receiverId, receiverName, receiverAvatar, callType, onEnd }: CallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState<'initiating' | 'ringing' | 'connected' | 'ended'>('initiating');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    initiateCall();
    return () => {
      endCall();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      startTimeRef.current = Date.now();
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const initiateCall = async () => {
    const token = localStorage.getItem('token');
    try {
      setStatus('ringing');
      
      const res = await fetch(`${API_URL}/calls/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          call_type: callType
        })
      });
      
      const data = await res.json();
      
      if (callType === 'video') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      setTimeout(() => {
        setStatus('connected');
        setIsConnected(true);
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to initiate call');
      onEnd();
    }
  };

  const endCall = async () => {
    const token = localStorage.getItem('token');
    try {
      if (callId) {
        await fetch(`${API_URL}/calls/${callId}/end`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ duration })
        });
      }
      
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      
      setStatus('ended');
      onEnd();
    } catch (error) {
      console.error('Failed to end call');
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="relative w-full h-full">
        {callType === 'video' ? (
          <>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-20 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white shadow-xl"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
            <div className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-6">
                <img src={receiverAvatar || '/placeholder-avatar.png'} alt={receiverName} />
              </Avatar>
              <h2 className="text-3xl font-bold text-white mb-2">{receiverName}</h2>
              <p className="text-white/80 text-lg">
                {status === 'ringing' && 'Calling...'}
                {status === 'connected' && formatDuration(duration)}
              </p>
            </div>
          </div>
        )}

        <div className="absolute top-6 left-6 text-white">
          <h3 className="text-xl font-semibold">{receiverName}</h3>
          <p className="text-sm opacity-80">
            {status === 'ringing' && 'Ringing...'}
            {status === 'connected' && formatDuration(duration)}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          {callType === 'video' && (
            <Button
              size="lg"
              variant={isVideoOff ? 'destructive' : 'secondary'}
              className="rounded-full w-14 h-14"
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </Button>
          )}
          
          <Button
            size="lg"
            variant={isMuted ? 'destructive' : 'secondary'}
            className="rounded-full w-14 h-14"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          <Button
            size="lg"
            variant="destructive"
            className="rounded-full w-16 h-16"
            onClick={endCall}
          >
            <Phone className="w-6 h-6 rotate-135" />
          </Button>
        </div>
      </div>
    </div>
  );
}
