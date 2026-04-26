import { Github, Instagram, Twitter, Heart } from "lucide-react";

function Footer() {
    return (
        <footer className="bg-slate-950 text-white pt-16 pb-8 px-6 mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                {/* Brand Info */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-2xl font-black tracking-tighter mb-4">
                        Campus<span className="text-orange-500">Crave</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                        Revolutionizing campus dining with smart group ordering and a seamless digital experience.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex gap-6 text-white/60">
                        <Instagram size={22} className="hover:text-orange-500 cursor-pointer transition-all hover:scale-110" />
                        <Twitter size={22} className="hover:text-orange-500 cursor-pointer transition-all hover:scale-110" />
                        <Github size={22} className="hover:text-orange-500 cursor-pointer transition-all hover:scale-110" />
                    </div>
                    <div className="h-px w-20 bg-slate-800 my-2"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        Eat. Share. Repeat.
                    </p>
                </div>

                {/* Contact/Support */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right text-sm">
                    <p className="text-slate-300 font-bold mb-2 uppercase tracking-widest text-[10px]">Student Support</p>
                    <a href="mailto:support@campuscrave.com" className="text-orange-400 font-black hover:text-white transition-colors">hello@campuscrave.com</a>
                    <div className="mt-4 flex gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col items-center justify-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
                    © 2026 CAMPUSCRAVE SYSTEM | MADE WITH <Heart size={12} className="text-red-500 fill-red-500" /> FOR STUDENTS
                </p>
            </div>
        </footer>
    );
}

export default Footer;