import Link from 'next/link';
import Image from 'next/image';
import {
    Call,
    CallControls,
    SpeakerLayout,
} from '@stream-io/video-react-sdk';

interface Props {
    onLeave: () => void;
    meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
    return (
        <div className="flex h-full flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar text-white p-4">
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4 w-full">
                <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full">
                    <Image
                        src="/logo.svg"
                        alt="Agentix Logo"
                        width={24}
                        height={24}
                        className="h-6 w-6"
                    />
                </Link>
                <h4 className='text-base'>{meetingName}</h4>
            </div>
            <SpeakerLayout/>
            <div className='bg-[#101213] rounded-full px-4'>
                <CallControls onLeave={onLeave}/>
            </div>
        </div>
    );
}

export default CallActive;


