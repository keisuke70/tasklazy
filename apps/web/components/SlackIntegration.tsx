import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UnrepliedMessage {
  sender: string;
  content: string;
}

interface SlackIntegrationProps {
  unrepliedMessages: UnrepliedMessage[];
}

export function SlackIntegration({ unrepliedMessages }: SlackIntegrationProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Unreplied Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {unrepliedMessages.map((message, index) => (
            <Card key={index} className="mb-4 last:mb-0">
              <CardContent className="p-4">
                <p className="font-semibold">{message.sender}</p>
                <p className="text-sm">{message.content}</p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
