use strict;
use warnings;
use Git;
use Term::ANSIColor   qw(color);
use IO::CaptureOutput qw(capture);

use constant NAME  => 'github-actions[bot]';
use constant EMAIL => 'github-actions[bot]@users.noreply.github.com';

main();
#_print_color( 'red', 'not ready yet!' );

sub main {
    Git::command_noisy( 'config', '--global', 'user.name',  NAME );
    Git::command_noisy( 'config', '--global', 'user.email', EMAIL );

    my $res = _get_git_command_noisy( 'status', '--porcelain' );

    if ( $res->{error} ) {
        _print_color( 'red', $res->{error} || "There was an error." );
        exit(2);
    }

    if ( length( $res->{output} ) >= 0 ) {
        Git::command_noisy( 'add', '.' );
        print( color('rgb524') );
        Git::command_noisy(
            'commit',                  '-m',
            'feat: update extensions', '-m',
            '[no-ci]',                 '--no-verify'
        );
        print( color('reset') );
        print( color('rgb543') );
        Git::command_noisy( 'push', '-u', 'origin', 'artifacts' );
        print( color('reset') );
    }
}

# printColor('name | rbgRBG','msg'); -> R:0-5, G:0-5, B:0-5
sub _print_color {
    print "${\color($_[0])}", "$_[1]", "${\color('reset')}";
}

sub _get_git_command_noisy {
    my ( $cmd, @args ) = @_;
    my $stdout = undef;
    my $stderr = undef;
    capture {
        Git::command_noisy( $cmd, @args );
    }
    \$stdout, \$stderr;
    return { output => $stdout, error => $stderr };
}
