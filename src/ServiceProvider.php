<?php

namespace Nimblephp\dialogbox;

use Krzysztofzylka\File\File;
use Nimblephp\framework\Interfaces\ServiceProviderInterface;
use Nimblephp\framework\Kernel;

class ServiceProvider implements ServiceProviderInterface
{

    public function register(): void
    {
        File::copy(__DIR__ . '/Resources/modal.js', Kernel::$projectPath . '/public/assets/modal.js');
    }

}