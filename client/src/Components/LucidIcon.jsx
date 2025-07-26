import React from "react";
import {
  Map,
  MessageSquareText,
  Bell,
  Menu,
  X,
  TrainFront,
  Clock,
  Ticket,
  LogIn,
  Search,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Navigation,
  Train,
  Route,
  CircleDotDashed,
  Play,
  StopCircle,
  Volume2,
} from "lucide-react";

const LucidIcon = ({ name, ...props }) => {
  const icons = {
    Map: Map,
    MessageSquareText: MessageSquareText,
    Bell: Bell,
    Menu: Menu,
    X: X,
    TrainFront: TrainFront,
    Clock: Clock,
    Ticket: Ticket,
    LogIn: LogIn,
    Search: Search,
    MapPin: MapPin,
    ArrowRight: ArrowRight,
    ArrowLeft: ArrowLeft,
    Mail: Mail,
    Lock: Lock,
    User: User,
    Navigation: Navigation,
    Train: Train,
    Route: Route,
    CircleDotDashed: CircleDotDashed,
    Play: Play,
    StopCircle: StopCircle,
    Volume2: Volume2,
  };
  const Icon = icons[name];
  return Icon ? <Icon {...props} /> : null;
};

export default LucidIcon;
