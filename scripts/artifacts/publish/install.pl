use strict;
use warnings;

my $filename = './publish/modules.pm';

open( FH, '<', $filename ) or die $!;

my @module_list = ();

while (<FH>) {
    my ($module) = $_ =~ /require.*('.*'|".*").*;/ig;
    push( @module_list, $module =~ s/('|")/ /rg ) if ($module);
}

close(FH);

print("Modules: @module_list\n");
system("cpanm @module_list");
