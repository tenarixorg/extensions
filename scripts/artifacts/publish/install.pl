use strict;
use warnings;

my $filename = './publish/modules.pm';

open( FH, '<', $filename ) or die $!;

my @module_list = ();

while (<FH>) {
    my ($module) = $_ =~ /require.*('.*'|".*").*;/ig;
    print("Module: $module\n");
    push( @module_list, $module =~ s/('|")/ /rg ) if ($module);
}

close(FH);

system("cpanm @module_list");
