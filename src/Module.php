<?php

namespace NimblePHP\Modal;

use Krzysztofzylka\File\File;
use NimblePHP\Framework\Abstracts\AbstractController;
use NimblePHP\Framework\Config;
use NimblePHP\Framework\Kernel;
use NimblePHP\Framework\Module\Interfaces\ModuleInterface;
use NimblePHP\Framework\Module\ModuleRegister;
use NimblePHP\Modal\Middlewares\ModalMiddleware;
use NimblePHP\Twig\Twig;

class Module implements ModuleInterface
{

    public function getName(): string
    {
        return 'Nimblephp Modals';
    }

    public function register(): void
    {
        Kernel::$middlewareManager->add(new ModalMiddleware());

        AbstractController::registerDynamicMethod('setModalTitle', function (string $name): void {
            ModalMiddleware::setModalTitle($this, $name);
        });

        AbstractController::registerDynamicMethod('setModalSize', function (string $size): void {
            ModalMiddleware::setModalSize($this, $size);
        });

        AbstractController::registerDynamicMethod('setModalFullscreen', function (bool $fullscreen): void {
            ModalMiddleware::setModalFullscreen($this, $fullscreen);
        });

        AbstractController::registerDynamicMethod('addModalMenuAction', function (string $name, string $url = '#', string $class = ''): void {
            ModalMiddleware::addModalMenuAction($this, $name, $url, $class);
        });

        AbstractController::registerDynamicMethod('renderModalConfigHeader', function (): void {
            ModalMiddleware::renderModalConfigHeader($this);
        });

        AbstractController::registerDynamicMethod('setModalClass', function (string $name, string $classes): void {
            ModalMiddleware::setModalClass($this, $name, $classes);
        });

        if (Config::get('MODAL_COPY_ASSET', true)) {
            File::copy(__DIR__ . '/Resources/modal.js', Kernel::$projectPath . '/public/assets/modal.js');

            if (ModuleRegister::moduleExistsInVendor('nimblephp/twig')) {
                try {
                    Twig::addJsHeader('/assets/modal.js');
                } catch (\Throwable) {
                }
            }
        }
    }

}