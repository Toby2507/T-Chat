import { BiDotsVerticalRounded } from 'react-icons/bi'
import { IoIosArrowBack, IoIosSend } from 'react-icons/io'

const ChatRoom = () => {
    return (
        <section className="container mx-auto h-screen grid grid-rows-[auto_1fr_auto]">
            <div className="px-4 py-2 flex gap-2 items-center bg-mainGray">
                <IoIosArrowBack className='text-lg text-white' />
                <div className="w-12 h-12 rounded-full bg-mainBlue grid place-items-center uppercase text-white text-xl">R</div>
                <div className="flex-1 flex flex-col items-start justify-center">
                    <h1 className="text-white text-base capitalize font-medium">oluwatobi salau</h1>
                    <span className="text-secondaryGray text-xs">Active</span>
                </div>
                <button className="text-white text-3xl"><BiDotsVerticalRounded /></button>
            </div>
            <div className="w-full h-full p-4 flex flex-col justify-start space-y-2 overflow-y-scroll">
                <div className="flex flex-col space-y-2">
                    <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">How are you?</article>
                    <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Did you have a good weekend?</article>
                    <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Can I get the result today or tomorrow?</article>
                    <p className="text-secondaryGray text-xs">10 July 2022 10:15pm</p>
                </div>
                <div className="self-end flex flex-col items-end space-y-2">
                    <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Hey, I did thank you</article>
                    <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Sure no problem, I’ll try to get it to you as soon as possible.</article>
                    <p className="text-secondaryGray text-xs">10 July 2022 10:17pm</p>
                </div>
                <div className="flex flex-col space-y-2">
                    <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Brother, complete asap please</article>
                    <p className="text-secondaryGray text-xs">10 July 2022 10:18pm</p>
                </div>
                <div className="self-end flex flex-col items-end space-y-2">
                    <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Hi, I'm done. I'll send it to you now</article>
                    <article className="w-full max-w-max bg-mainBlue text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-br-none">Check your slack bro</article>
                    <p className="text-secondaryGray text-xs">11 July 2022 7:59am</p>
                </div>
                <div className="flex flex-col space-y-2">
                    <article className="w-full max-w-max bg-mainGray text-white text-sm px-4 py-2 rounded-3xl last-of-type:rounded-bl-none">Okay, thanks.</article>
                    <p className="text-secondaryGray text-xs">11 July 2022 8:14pm</p>
                </div>
            </div>
            <div className="px-4 py-3 flex gap-2 items-center bg-mainGray">
                <form className="w-full flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder='Search user...'
                        className='flex-1 h-10 rounded-3xl bg-accentGray px-4 py-1 text-white text-sm focus:outline-none placeholder:text-white'
                    />
                    <button aria-label='search by username' className="w-10 h-10 rounded-full bg-accentGray grid place-items-center uppercase text-white text-2xl"><IoIosSend /></button>
                </form>
            </div>
        </section>
    )
}

export default ChatRoom