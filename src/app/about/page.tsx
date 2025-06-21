import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">About</h1>
          <p className="text-xl text-muted-foreground mt-2">Learn more about our Hypixel Bedwars stats tracker</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>What makes our stats tracker special</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">
                This easy-to-use Hypixel bedwars stat checker is one of the most detailed stats trackers. Get all the information you need in one place. You can easily show how good you are sharing
                your stats link with your friends.
              </p>
              <p className="text-sm leading-relaxed">
                We created this website to give the basic player data, as well as more advanced information about different modes and stats. We are always improving this website to be more detailed to
                make it the best.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with the developer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Developer</h4>
                <p className="text-sm text-muted-foreground">This website was made by Shivam.</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contact</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Email:{" "}
                  <a href="mailto:support@shivam.pro" className="text-primary hover:underline">
                    support@shivam.pro
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Website:{" "}
                  <a href="https://shivam.pro" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    shivam.pro
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  You can also try to contact me via my username <code className="bg-muted px-1.5 py-0.5 rounded text-xs">shivamCode</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
